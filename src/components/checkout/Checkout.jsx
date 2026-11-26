import React, { useState, useEffect } from 'react';
import { BRAND } from '../../config/brand';
import { useAuth } from '../../lib/auth';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Card, Button, Badge } from '../ui';
import { ShieldCheck, Check, Lock, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Checkout() {
  const { user, profile, subscription, refreshSubscription } = useAuth();
  const searchParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const planKey = searchParams.get('plan') || 'pro_yearly';

  const plan = BRAND.pricing.plans[planKey === 'pro_monthly' ? 'monthly' : planKey === 'exam_pack_3m' ? 'examPack' : 'yearly'];

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successActive, setSuccessActive] = useState(false);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleStartPayment = async () => {
    if (!user) {
      window.location.href = `#/login?redirect=checkout&plan=${planKey}`;
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      // If in demo / mock mode without live backend, simulate successful upgrade
      if (!isSupabaseConfigured || !razorpayKey || razorpayKey.includes('YourTestKeyIdHere')) {
        setTimeout(async () => {
          setSuccessActive(true);
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
          setLoading(false);
        }, 1000);
        return;
      }

      // Live Razorpay options
      const options = {
        key: razorpayKey,
        amount: plan.price * 100, // in paise
        currency: 'INR',
        name: BRAND.name,
        description: `${plan.name} Subscription`,
        image: `${window.location.origin}/icon.png`,
        prefill: {
          name: profile?.full_name || '',
          email: user?.email || '',
        },
        theme: {
          color: BRAND.colors.accent,
        },
        handler: async function (response) {
          try {
            // Verify payment on server
            const { data, error } = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan: planKey,
                amount: plan.price * 100
              }
            });

            if (error) throw error;
            await refreshSubscription();
            setSuccessActive(true);
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
          } catch (err) {
            setErrorMsg(err.message || 'Payment verification failed. Please contact support.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setErrorMsg(`Payment Failed: ${resp.error.description}`);
      });
      rzp.open();

    } catch (err) {
      setErrorMsg(err.message || 'Failed to initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  if (successActive) {
    return (
      <div className="max-w-content mx-auto py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-surface border border-border rounded-card p-8 shadow-subtle animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-accent-soft text-accent flex items-center justify-center mx-auto mb-4 border border-accent/20">
            <Check className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-text tracking-tight mb-2">
            Pro Plan Activated!
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
            Congratulations! Your account now has unlimited access to all English & Hindi courses, government exam simulators, and verified certificates.
          </p>

          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '#/exams'}
            className="w-full justify-center"
          >
            <span>Go to Exam Simulator</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto py-12 md:py-20 px-4">
      <div className="max-w-md mx-auto">
        <a
          href="#/pricing"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text font-medium mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Plans</span>
        </a>

        <Card className="p-6 sm:p-8">
          <div className="text-2xs font-semibold uppercase tracking-wider text-accent mb-1">
            Order Summary
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-text mb-4">
            {plan.name}
          </h1>

          <div className="p-4 rounded bg-surface-2 border border-border mb-6">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs text-text-muted">Subscription Fee</span>
              <span className="font-mono text-lg font-bold text-text">₹{plan.price}</span>
            </div>
            <div className="flex items-center justify-between text-2xs text-text-muted">
              <span>Taxes (18% GST)</span>
              <span>Included</span>
            </div>
            <div className="pt-2 mt-2 border-t border-border flex items-baseline justify-between font-semibold text-text text-sm">
              <span>Total Payable</span>
              <span className="font-mono text-xl text-accent">₹{plan.price}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-xs text-error flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <div className="text-2xs font-semibold uppercase tracking-wider text-text-muted">
              Included in this plan:
            </div>
            <ul className="space-y-2 text-xs text-text-muted">
              {plan.features.slice(0, 5).map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleStartPayment}
            disabled={loading}
            className="w-full justify-center !bg-pro hover:!bg-pro-hover text-white shadow-subtle mb-4"
          >
            <Lock className="w-4 h-4 mr-1.5" />
            <span>{loading ? 'Processing...' : `Pay ₹${plan.price} via Razorpay`}</span>
          </Button>

          <div className="text-center text-2xs text-text-muted leading-relaxed">
            <p className="flex items-center justify-center gap-1 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Secured by 256-bit SSL encryption & Razorpay</span>
            </p>
            <p>Supports UPI (Google Pay, PhonePe, Paytm), Debit & Credit Cards, Netbanking.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
