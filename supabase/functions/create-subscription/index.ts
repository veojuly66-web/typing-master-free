// Supabase Edge Function: create-subscription
// Creates a Razorpay recurring subscription for logged-in user (pro_monthly or pro_yearly)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized user' }), { status: 401, headers: corsHeaders });
    }

    const { plan = 'pro_monthly' } = await req.json();
    if (plan !== 'pro_monthly' && plan !== 'pro_yearly') {
      return new Response(JSON.stringify({ error: 'Subscriptions are only supported for pro_monthly and pro_yearly' }), { status: 400, headers: corsHeaders });
    }

    const razorpayPlanId = plan === 'pro_yearly'
      ? Deno.env.get('RAZORPAY_PLAN_ID_YEARLY')
      : Deno.env.get('RAZORPAY_PLAN_ID_MONTHLY');

    const totalCount = plan === 'pro_yearly' ? 10 : 120; // up to 10 years
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || Deno.env.get('VITE_RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret || !razorpayPlanId) {
      return new Response(JSON.stringify({ error: 'Razorpay subscription plans not configured on server' }), { status: 500, headers: corsHeaders });
    }

    const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const rzpRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: razorpayPlanId,
        total_count: totalCount,
        quantity: 1,
        customer_notify: 1,
        notes: {
          user_id: user.id,
          user_email: user.email,
          plan
        }
      })
    });

    const subscriptionData = await rzpRes.json();
    if (!rzpRes.ok) {
      return new Response(JSON.stringify({ error: subscriptionData.error?.description || 'Failed to create subscription' }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify(subscriptionData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
