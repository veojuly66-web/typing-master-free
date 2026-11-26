import React from 'react';
import { BRAND } from '../config/brand';
import { Card } from './ui';

export default function ShippingPolicy() {
  return (
    <div className="max-w-content mx-auto py-10 md:py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-2">
          Shipping & Delivery Policy (Digital Service)
        </h1>
        <p className="text-xs text-text-muted mb-8">
          Last updated: November 26, 2026 · {BRAND.legalEntity}
        </p>

        <div className="prose prose-sm dark:prose-invert space-y-6 text-xs sm:text-sm text-text-muted leading-relaxed">
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-text">1. Digital Delivery Only</h2>
            <p>
              {BRAND.name} is an entirely cloud-hosted software-as-a-service (SaaS) platform for touch-typing training. We do not sell, ship, or deliver any physical merchandise or hardware items.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-text">2. Instant Service Fulfillment</h2>
            <p>
              Upon successful payment authorization via our Razorpay payment gateway:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your Pro account access is activated <strong>immediately in real time</strong>.</li>
              <li>You will receive an automated payment confirmation and GST receipt at your registered email address within 5 minutes.</li>
              <li>All unlocked courses, government exam simulators, and analytics are accessible instantly by signing into your account on any compatible browser.</li>
            </ul>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-text">3. Access Issues & Delivery Inquiries</h2>
            <p>
              If your Pro subscription does not activate automatically within 10 minutes of completing payment, please verify your transaction status in your banking app and contact our technical desk immediately:
            </p>
            <p className="font-mono text-text">
              Email: {BRAND.contact.email}<br />
              Support Desk: {BRAND.contact.hours}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
