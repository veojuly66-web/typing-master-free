import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../lib/auth';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Card, Button, Badge } from '../ui';
import { Mail, ArrowRight, ShieldCheck, Check, AlertCircle } from 'lucide-react';

function getPostLoginTarget() {
  const query = window.location.hash.split('?')[1] || '';
  const params = new URLSearchParams(query);
  const rawRedirect = params.get('redirect');
  if (!rawRedirect) return 'account';

  // Sanitize to internal hash route (prevent open redirect to external URLs)
  const sanitized = rawRedirect.replace(/^#\/?/, '');
  if (!sanitized || sanitized.includes('://') || sanitized.startsWith('//')) {
    return 'account';
  }
  const plan = params.get('plan');
  if (sanitized === 'checkout' && plan && !sanitized.includes('plan=')) {
    return `checkout?plan=${encodeURIComponent(plan)}`;
  }
  return sanitized;
}

export default function Login() {
  const { user, loading: authLoading, signInWithGoogle, signInWithOtp, verifyOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [googleEnabled, setGoogleEnabled] = useState(false);

  const redirectTarget = useMemo(() => getPostLoginTarget(), []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.external?.google) {
          setGoogleEnabled(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      window.location.hash = `#/${redirectTarget}`;
    }
  }, [authLoading, user, redirectTarget]);

  if (!authLoading && user) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const { error } = await signInWithGoogle(redirectTarget);
      if (error) throw error;
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      const { error } = await signInWithOtp(email, redirectTarget);
      if (error) throw error;
      setOtpSent(true);
      setSuccessMsg('A 6-digit login code has been sent to your email.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send login code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpToken || otpToken.length < 6) {
      setErrorMsg('Please enter the 6-digit code received on your email.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const { error } = await verifyOtp(email, otpToken);
      if (error) throw error;
      window.location.hash = `#/${redirectTarget}`;
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-content mx-auto py-12 md:py-20 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="accent" className="mb-2">Student & Aspirant Account</Badge>
          <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-2">
            Sign in to Pankaj Typing
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Sync your typing speed across devices and access Pro courses.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {!isSupabaseConfigured && (
            <div className="mb-4 p-3 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-2xs text-amber-800 dark:text-amber-300">
              <strong>Dev Mode Notice:</strong> Supabase keys are not set in `.env`. Guests can continue using all free courses and tests completely offline.
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-xs text-error flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign In (shown automatically once Google provider is enabled in Supabase) */}
          {googleEnabled && (
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full justify-center gap-2 mb-5 py-2.5 font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </Button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-2xs uppercase tracking-wider text-text-muted">or passwordless email</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-2xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded bg-surface border border-border text-text focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full justify-center"
              >
                <span>{loading ? 'Sending code...' : 'Send Login Code'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="login-otp" className="block text-2xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  id="login-otp"
                  type="text"
                  maxLength={6}
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full px-3 py-2 text-center text-lg font-mono tracking-widest rounded bg-surface border border-border text-text focus:outline-none focus:border-accent"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full justify-center"
              >
                <span>{loading ? 'Verifying...' : 'Verify & Sign In'}</span>
              </Button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="block w-full text-center text-xs text-text-muted hover:text-text underline mt-2"
              >
                Change email address
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-1.5 text-2xs text-text-muted text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>No passwords to remember. 100% private and spam-free.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
