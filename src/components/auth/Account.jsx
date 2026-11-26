import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { BRAND } from '../../config/brand';
import { Storage } from '../../lib/storage';
import { Card, Button, Badge, PlanBadge } from '../ui';
import { User, Mail, Calendar, ShieldCheck, Download, Trash2, LogOut, ArrowRight, Check } from 'lucide-react';

export default function Account() {
  const { user, profile, subscription, isProUser, trialDaysLeft, signOut, refreshSubscription } = useAuth();
  const [canceling, setCanceling] = useState(false);
  const [msg, setMsg] = useState('');

  if (!user) {
    return null;
  }

  const handleExportData = () => {
    Storage.exportBackupJSON();
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '#/';
  };

  const planTitle = subscription?.plan === 'pro_yearly'
    ? 'Pro Yearly'
    : subscription?.plan === 'exam_pack_3m'
    ? 'Exam Pack (3 Months)'
    : subscription?.plan === 'pro_monthly'
    ? 'Pro Monthly'
    : 'Free Plan';

  const periodEndStr = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'N/A';

  return (
    <div className="max-w-content mx-auto py-10 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight">
              Account & Subscription
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Manage your profile, active plans, invoices, and cloud data synchronization.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5 text-text-muted hover:text-text">
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Subscription Status Card */}
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-border">
              <div>
                <span className="text-2xs font-semibold uppercase tracking-wider text-text-muted block mb-1">
                  Active Subscription
                </span>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-text">{planTitle}</h2>
                  <PlanBadge plan={isProUser ? 'pro' : subscription?.status === 'trialing' ? 'trial' : 'free'} trialDaysLeft={trialDaysLeft} />
                </div>
              </div>

              {!isProUser ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => window.location.href = '#/pricing'}
                  className="!bg-pro hover:!bg-pro-hover text-white gap-1.5"
                >
                  <span>Upgrade to Pro</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <span className="text-xs text-accent font-medium inline-flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Pro Unlocked</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-muted">
              <div>
                <span className="block text-2xs uppercase tracking-wider mb-0.5">Status</span>
                <span className="font-semibold text-text capitalize">{subscription?.status || 'Active (Free)'}</span>
              </div>
              <div>
                <span className="block text-2xs uppercase tracking-wider mb-0.5">Next Renewal / Expiry</span>
                <span className="font-semibold text-text">{periodEndStr}</span>
              </div>
              <div>
                <span className="block text-2xs uppercase tracking-wider mb-0.5">Payment Method</span>
                <span className="font-semibold text-text">Razorpay UPI / Card</span>
              </div>
            </div>

            {isProUser && subscription?.status === 'active' && (
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  Need to cancel your subscription? You will keep Pro access until {periodEndStr}.
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert(`To cancel recurring subscription, please contact support at ${BRAND.contact.email} or use your UPI mandate manager in GooglePay/PhonePe.`)}
                  className="text-text-muted hover:text-error text-2xs"
                >
                  Cancel Plan
                </Button>
              </div>
            )}
          </Card>

          {/* Profile Card */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-text mb-4">Profile Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-2xs uppercase tracking-wider text-text-muted block mb-1">Email</label>
                <div className="p-2.5 rounded bg-surface-2 border border-border text-text font-mono">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="text-2xs uppercase tracking-wider text-text-muted block mb-1">User ID</label>
                <div className="p-2.5 rounded bg-surface-2 border border-border text-text-muted font-mono truncate">
                  {user.id}
                </div>
              </div>
            </div>
          </Card>

          {/* Data Management & Privacy */}
          <Card className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-text mb-1">Download Your Data</h3>
              <p className="text-xs text-text-muted max-w-md">
                Export all your completed lesson scores, test histories, and keystroke latencies as a JSON file.
              </p>
            </div>

            <Button variant="secondary" size="md" onClick={handleExportData} className="gap-1.5 shrink-0">
              <Download className="w-4 h-4 text-text-muted" />
              <span>Export JSON Backup</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
