// Supabase Edge Function: razorpay-webhook
// Idempotent webhook handler verifying x-razorpay-signature

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

serve(async (req) => {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      return new Response('Webhook signature or secret missing', { status: 400 });
    }

    const rawBody = await req.text();
    const expectedSignature = await hmacSha256Hex(webhookSecret, rawBody);

    if (!timingSafeEqual(signature, expectedSignature)) {
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
      const plan = notes.plan || 'pro_monthly';

      if (userId) {
        const now = new Date();
        const fallbackEnd = new Date(now);
        if (plan === 'pro_yearly') fallbackEnd.setFullYear(now.getFullYear() + 1);
        else fallbackEnd.setMonth(now.getMonth() + 1);

        const periodEnd = subEntity.current_end ? new Date(subEntity.current_end * 1000) : fallbackEnd;
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan,
            status: 'active',
            razorpay_subscription_id: subEntity.id,
            current_period_start: now.toISOString(),
            current_period_end: periodEnd.toISOString(),
            cancel_at_period_end: false,
            updated_at: now.toISOString()
          }, { onConflict: 'user_id' });
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

    // 4. Payment Failed
    if (eventType === 'payment.failed') {
      const paymentEntity = payload.payment?.entity;
      const notes = paymentEntity?.notes || {};
      const userId = notes.user_id;

      if (userId && paymentEntity?.id) {
        await supabase.from('payments').upsert({
          user_id: userId,
          razorpay_payment_id: paymentEntity.id,
          razorpay_order_id: paymentEntity.order_id || null,
          amount: paymentEntity.amount || 0,
          currency: paymentEntity.currency || 'INR',
          status: 'failed',
          plan: notes.plan || 'pro_monthly',
          method: paymentEntity.method || null
        }, { onConflict: 'razorpay_payment_id', ignoreDuplicates: true });
      }
    }

    return new Response(JSON.stringify({ status: 'ok', received: eventType }), { status: 200 });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
