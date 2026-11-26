// Supabase Edge Function: verify-payment
// Server-side HMAC-SHA256 signature verification for Razorpay checkout

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_subscription_id,
      razorpay_signature,
      plan = 'pro_monthly',
      amount = 9900
    } = await req.json();

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!razorpayKeySecret) {
      return new Response(JSON.stringify({ error: 'Razorpay secret not configured' }), { status: 500, headers: corsHeaders });
    }

    // Verify HMAC-SHA256 signature
    let generatedSignature = '';
    if (razorpay_subscription_id) {
      // Subscription signature: payment_id + "|" + subscription_id
      generatedSignature = hmac('sha256', razorpayKeySecret, `${razorpay_payment_id}|${razorpay_subscription_id}`, 'utf8', 'hex');
    } else if (razorpay_order_id) {
      // Order signature: order_id + "|" + payment_id
      generatedSignature = hmac('sha256', razorpayKeySecret, `${razorpay_order_id}|${razorpay_payment_id}`, 'utf8', 'hex');
    }

    if (generatedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ error: 'Invalid payment signature' }), { status: 400, headers: corsHeaders });
    }

    // Determine period duration
    const now = new Date();
    let periodEnd = new Date(now);
    if (plan === 'pro_yearly') {
      periodEnd.setFullYear(now.getFullYear() + 1);
    } else if (plan === 'exam_pack_3m') {
      periodEnd.setDate(now.getDate() + 90);
    } else {
      periodEnd.setMonth(now.getMonth() + 1);
    }

    // Upsert subscription row
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        plan,
        status: 'active',
        razorpay_payment_id,
        razorpay_order_id: razorpay_order_id || null,
        razorpay_subscription_id: razorpay_subscription_id || null,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
        updated_at: now.toISOString()
      }, { onConflict: 'user_id' });

    // Record payment
    await supabase.from('payments').insert({
      user_id: user.id,
      razorpay_payment_id,
      razorpay_order_id: razorpay_order_id || null,
      razorpay_signature,
      amount,
      currency: 'INR',
      status: 'captured',
      plan,
      created_at: now.toISOString()
    });

    return new Response(JSON.stringify({ success: true, plan, current_period_end: periodEnd }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
