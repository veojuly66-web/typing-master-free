// Supabase Edge Function: razorpay-webhook
// Idempotent webhook handler verifying x-razorpay-signature

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

serve(async (req) => {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      return new Response('Webhook signature or secret missing', { status: 400 });
    }

    const rawBody = await req.text();
    const expectedSignature = hmac('sha256', webhookSecret, rawBody, 'utf8', 'hex');

    if (signature !== expectedSignature) {
      return new Response('Invalid webhook signature', { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Subscription Activated / Charged
    if (eventType === 'subscription.activated' || eventType === 'subscription.charged') {
      const subEntity = payload.subscription.entity;
      const notes = subEntity.notes || {};
      const userId = notes.user_id;

      if (userId) {
        const periodEnd = new Date(subEntity.current_end * 1000);
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            razorpay_subscription_id: subEntity.id,
            current_period_end: periodEnd.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      }
    }

    // 2. Subscription Cancelled / Halted
    if (eventType === 'subscription.cancelled' || eventType === 'subscription.halted') {
      const subEntity = payload.subscription.entity;
      const notes = subEntity.notes || {};
      const userId = notes.user_id;

      if (userId) {
        await supabase
          .from('subscriptions')
          .update({
            status: eventType === 'subscription.cancelled' ? 'canceled' : 'past_due',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      }
    }

    // 3. One-time Order Paid (Exam Pack)
    if (eventType === 'order.paid') {
      const orderEntity = payload.order.entity;
      const notes = orderEntity.notes || {};
      const userId = notes.user_id;
      const plan = notes.plan || 'exam_pack_3m';

      if (userId) {
        const now = new Date();
        const periodEnd = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan,
            status: 'active',
            razorpay_order_id: orderEntity.id,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            updated_at: now.toISOString()
          }, { onConflict: 'user_id' });
      }
    }

    return new Response(JSON.stringify({ status: 'ok', received: eventType }), { status: 200 });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
