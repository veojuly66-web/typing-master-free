import React from 'react';
import { Button } from './ui';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center select-none">
      <div className="font-mono text-5xl font-semibold tabular-nums text-accent mb-3">404</div>
      <h1 className="text-xl font-semibold text-text mb-2">Page Not Found</h1>
      <p className="text-xs text-text-muted leading-relaxed mb-6">
        The link you followed does not exist or may have been moved. You can return to the home page or resume your typing lessons below.
      </p>

      <div className="flex items-center justify-center gap-3">
        <Button variant="primary" size="sm" onClick={() => { window.location.hash = '#/'; }}>
          <Home className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Home</span>
        </Button>
        <Button variant="secondary" size="sm" onClick={() => { window.location.hash = '#/lessons'; }}>
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Back to Lessons</span>
        </Button>
      </div>
    </div>
  );
}
