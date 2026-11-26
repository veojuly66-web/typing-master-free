import React, { useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { BRAND } from '../../config/brand';
import { Button } from '../ui';
import { AlertCircle } from 'lucide-react';

/**
 * Auth guard wrapper for protected routes (#/account, #/checkout, #/admin).
 * Waits for session loading before redirecting so refreshes don't flash-logout.
 */
export default function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectPath = 'account'
}) {
  const { user, loading } = useAuth();
  const isAdmin = Boolean(user && user.email === BRAND.adminEmail);

  useEffect(() => {
    if (!loading && !user) {
      const currentHash = window.location.hash.replace(/^#\/?/, '') || redirectPath;
      window.location.hash = `#/login?redirect=${encodeURIComponent(currentHash)}`;
    }
  }, [loading, user, redirectPath]);

  if (loading) {
    return (
      <div className="max-w-content mx-auto py-20 px-4 text-center">
        <div className="inline-block w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-text-muted">Checking your session...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="max-w-content mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-error flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-semibold text-text mb-2">Access Denied</h1>
        <p className="text-xs text-text-muted max-w-sm mx-auto mb-4">
          This administration dashboard is restricted to the administrator account ({BRAND.adminEmail}). You are signed in as {user.email}.
        </p>
        <Button variant="outline" size="sm" onClick={() => { window.location.hash = '#/'; }}>
          Back to Home
        </Button>
      </div>
    );
  }

  return children;
}
