// Supabase Edge Function: create-order
// Creates a one-time Razorpay order with server-authoritative pricing

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Server-side authoritative plan pricing in paise (never trust client-supplied amounts)
const PLAN_PRICES_PAISE: Record<string, number> = {
  pro_monthly: 9900,
  pro_yearly: 49900,
  exam_pack_3m: 24900,
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

    const { plan = 'exam_pack_3m' } = await req.json();
    const amount = PLAN_PRICES_PAISE[plan];
    if (!amount) {
      return new Response(JSON.stringify({ error: 'Invalid plan selected' }), { status: 400, headers: corsHeaders });
    }

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || Deno.env.get('VITE_RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(JSON.stringify({ error: 'Razorpay keys not configured' }), { status: 500, headers: corsHeaders });
    }

    const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const receipt = `rcpt_${user.id.substring(0, 8)}_${Date.now()}`;

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt,
        notes: {
          user_id: user.id,
          user_email: user.email,
          plan
        }
      })
    });

    const orderData = await rzpRes.json();
    if (!rzpRes.ok) {
      return new Response(JSON.stringify({ error: orderData.error?.description || 'Failed to create order' }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify(orderData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
