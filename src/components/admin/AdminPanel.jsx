import React, { useState } from 'react';
import { BRAND } from '../../config/brand';
import { useAuth } from '../../lib/auth';
import { Card, Button, Badge } from '../ui';
import { ShieldCheck, Users, CreditCard, Sparkles, AlertCircle, Plus, Check } from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const isAdmin = user && user.email === BRAND.adminEmail;

  const [targetEmail, setTargetEmail] = useState('');
  const [grantDuration, setGrantDuration] = useState('30');
  const [grantSuccess, setGrantSuccess] = useState('');
  const [coupons, setCoupons] = useState([
    { code: 'LAUNCH50', discount: '50% OFF', active: true },
    { code: 'GOVTEXAM', discount: '₹100 OFF', active: true }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  if (!user) {
    return (
      <div className="max-w-content mx-auto py-20 px-4 text-center">
        <h1 className="text-xl font-semibold text-text mb-2">Admin Authentication Required</h1>
        <p className="text-xs text-text-muted mb-4">Please log in with the administrator email ({BRAND.adminEmail}).</p>
        <Button variant="primary" size="md" onClick={() => window.location.href = '#/login'}>
          Go to Sign In
        </Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-content mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-error flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-semibold text-text mb-2">Access Denied</h1>
        <p className="text-xs text-text-muted max-w-sm mx-auto mb-4">
          This administration dashboard is restricted to the administrator account ({BRAND.adminEmail}). You are signed in as {user.email}.
        </p>
        <Button variant="outline" size="sm" onClick={() => window.location.href = '#/'}>
          Back to Home
        </Button>
      </div>
    );
  }

  const handleGrantPro = (e) => {
    e.preventDefault();
    if (!targetEmail || !targetEmail.includes('@')) return;

    // Simulate or execute Pro grant
    setGrantSuccess(`Successfully granted ${grantDuration} days Pro access to ${targetEmail}`);
    setTargetEmail('');
    setTimeout(() => setGrantSuccess(''), 4000);
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode) return;
    setCoupons(prev => [...prev, { code: newCouponCode.toUpperCase(), discount: newCouponDiscount || '20% OFF', active: true }]);
    setNewCouponCode('');
    setNewCouponDiscount('');
  };

  return (
    <div className="max-w-content mx-auto py-10 md:py-16 px-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-border">
        <div>
          <Badge variant="accent" className="mb-1.5">Owner Desk</Badge>
          <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight">
            Admin Management Console
          </h1>
          <p className="text-xs text-text-muted">
            Managing {BRAND.name} · Signed in as {user.email}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-xs">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-muted font-medium uppercase text-2xs">Total Registered</span>
            <Users className="w-4 h-4 text-accent" />
          </div>
          <div className="font-mono text-3xl font-bold text-text">1,420</div>
          <div className="text-2xs text-accent mt-1">+128 this week</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-muted font-medium uppercase text-2xs">Active Pro Subscribers</span>
            <Sparkles className="w-4 h-4 text-pro" />
          </div>
          <div className="font-mono text-3xl font-bold text-pro">284</div>
          <div className="text-2xs text-text-muted mt-1">₹499 & ₹99 plans</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-muted font-medium uppercase text-2xs">Active Trials</span>
            <ShieldCheck className="w-4 h-4 text-text-muted" />
          </div>
          <div className="font-mono text-3xl font-bold text-text">512</div>
          <div className="text-2xs text-text-muted mt-1">7-day free trials</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-muted font-medium uppercase text-2xs">Estimated Monthly MRR</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-mono text-3xl font-bold text-emerald-700 dark:text-emerald-400">₹42,850</div>
          <div className="text-2xs text-emerald-600 mt-1">via Razorpay</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Manual Pro Access Tool */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-text mb-1">Grant / Extend Pro Access</h2>
          <p className="text-xs text-text-muted mb-4">
            Manually unlock Pro access for a student, contest winner, or institute student by email.
          </p>

          {grantSuccess && (
            <div className="mb-4 p-3 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{grantSuccess}</span>
            </div>
          )}

          <form onSubmit={handleGrantPro} className="space-y-4 text-xs">
            <div>
              <label htmlFor="target-user-email" className="block text-2xs uppercase text-text-muted mb-1">User Email</label>
              <input
                id="target-user-email"
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="student@example.com"
                required
                className="w-full px-3 py-2 rounded bg-surface border border-border text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label htmlFor="target-duration" className="block text-2xs uppercase text-text-muted mb-1">Duration</label>
              <select
                id="target-duration"
                value={grantDuration}
                onChange={(e) => setGrantDuration(e.target.value)}
                className="w-full px-3 py-2 rounded bg-surface border border-border text-text"
              >
                <option value="30">30 Days (1 Month)</option>
                <option value="90">90 Days (Exam Pack)</option>
                <option value="365">365 Days (1 Year)</option>
                <option value="9999">Lifetime / Unlimited</option>
              </select>
            </div>

            <Button type="submit" variant="primary" size="md">
              <span>Grant Pro Access</span>
            </Button>
          </form>
        </Card>

        {/* Coupon Codes Management */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-text mb-1">Promo & Discount Coupons</h2>
          <p className="text-xs text-text-muted mb-4">
            Manage promotional discount codes for recruitment batches and marketing drives.
          </p>

          <div className="space-y-2 mb-6">
            {coupons.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded bg-surface-2 border border-border text-xs">
                <div>
                  <span className="font-mono font-bold text-text">{c.code}</span>
                  <span className="text-text-muted ml-2">({c.discount})</span>
                </div>
                <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  Active
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddCoupon} className="flex gap-2">
            <input
              type="text"
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value)}
              placeholder="e.g. DIWALI30"
              className="flex-1 px-3 py-1.5 text-xs rounded bg-surface border border-border font-mono uppercase"
            />
            <input
              type="text"
              value={newCouponDiscount}
              onChange={(e) => setNewCouponDiscount(e.target.value)}
              placeholder="30% OFF"
              className="w-28 px-3 py-1.5 text-xs rounded bg-surface border border-border"
            />
            <Button type="submit" variant="secondary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add</span>
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
