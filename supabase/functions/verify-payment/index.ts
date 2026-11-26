// Supabase Edge Function: verify-payment
// Server-side HMAC-SHA256 signature verification + Razorpay authoritative amount/plan validation

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_PRICES_PAISE: Record<string, number> = {
  pro_monthly: 9900,
  pro_yearly: 49900,
  exam_pack_3m: 24900,
};

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
      plan: requestedPlan = 'pro_monthly',
    } = await req.json();

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || Deno.env.get('VITE_RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(JSON.stringify({ error: 'Razorpay credentials not configured' }), { status: 500, headers: corsHeaders });
    }

    // 1. Verify HMAC-SHA256 signature
    let generatedSignature = '';
    if (razorpay_subscription_id) {
      generatedSignature = await hmacSha256Hex(razorpayKeySecret, `${razorpay_payment_id}|${razorpay_subscription_id}`);
    } else if (razorpay_order_id) {
      generatedSignature = await hmacSha256Hex(razorpayKeySecret, `${razorpay_order_id}|${razorpay_payment_id}`);
    }

    if (!razorpay_signature || !generatedSignature || !timingSafeEqual(generatedSignature, razorpay_signature)) {
      return new Response(JSON.stringify({ error: 'Invalid payment signature' }), { status: 400, headers: corsHeaders });
    }

    // 2. Query Razorpay API directly to prevent amount/plan tampering
    const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const paymentRes = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, {
      headers: { 'Authorization': `Basic ${basicAuth}` }
    });
    const paymentData = await paymentRes.json();
    if (!paymentRes.ok) {
      return new Response(JSON.stringify({ error: 'Could not verify payment with Razorpay' }), { status: 400, headers: corsHeaders });
    }

    let authoritativeNotes = paymentData.notes || {};
    if (razorpay_subscription_id && !authoritativeNotes.user_id) {
      const subRes = await fetch(`https://api.razorpay.com/v1/subscriptions/${encodeURIComponent(razorpay_subscription_id)}`, {
        headers: { 'Authorization': `Basic ${basicAuth}` }
      });
      if (subRes.ok) {
        const subData = await subRes.json();
        authoritativeNotes = subData.notes || authoritativeNotes;
      }
    }

    const verifiedPlan = authoritativeNotes.plan || requestedPlan;
    const expectedAmount = PLAN_PRICES_PAISE[verifiedPlan];
    if (!expectedAmount || paymentData.amount < expectedAmount || paymentData.currency !== 'INR') {
      return new Response(JSON.stringify({ error: 'Payment amount does not match selected plan' }), { status: 400, headers: corsHeaders });
    }
    if (authoritativeNotes.user_id && authoritativeNotes.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Payment ownership mismatch' }), { status: 403, headers: corsHeaders });
    }
    if (paymentData.status !== 'captured' && paymentData.status !== 'authorized') {
      return new Response(JSON.stringify({ error: 'Payment is not captured' }), { status: 400, headers: corsHeaders });
    }

    // 3. Determine period duration using verified plan
    const now = new Date();
    const periodEnd = new Date(now);
    if (verifiedPlan === 'pro_yearly') {
      periodEnd.setFullYear(now.getFullYear() + 1);
    } else if (verifiedPlan === 'exam_pack_3m') {
      periodEnd.setDate(now.getDate() + 90);
    } else {
      periodEnd.setMonth(now.getMonth() + 1);
    }

    // 4. Upsert subscription row
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        plan: verifiedPlan,
        status: 'active',
        razorpay_payment_id,
        razorpay_order_id: razorpay_order_id || null,
        razorpay_subscription_id: razorpay_subscription_id || null,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
        updated_at: now.toISOString()
      }, { onConflict: 'user_id' });

    if (subError) {
      return new Response(JSON.stringify({ error: subError.message }), { status: 500, headers: corsHeaders });
    }

    // 5. Record payment idempotently using verified Razorpay amount & method
    await supabase.from('payments').upsert({
      user_id: user.id,
      razorpay_payment_id,
      razorpay_order_id: razorpay_order_id || null,
      razorpay_signature,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      status: paymentData.status,
      plan: verifiedPlan,
      method: paymentData.method || null,
      created_at: now.toISOString()
    }, { onConflict: 'razorpay_payment_id', ignoreDuplicates: true });

    return new Response(JSON.stringify({ success: true, plan: verifiedPlan, current_period_end: periodEnd }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
