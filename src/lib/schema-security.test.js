import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Supabase Schema & RLS Security Audit', () => {
  const migrationSql = readFileSync(
    resolve(process.cwd(), 'supabase/migrations/20261126000001_create_schema_and_rls.sql'),
    'utf8'
  );

  it('enables RLS on every table created in public schema', () => {
    const tables = [...migrationSql.matchAll(/CREATE TABLE IF NOT EXISTS public\.(\w+)/g)].map((m) => m[1]);
    expect(tables.length).toBeGreaterThanOrEqual(11);

    tables.forEach((table) => {
      expect(migrationSql).toContain(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
    });
  });

  it('places SECURITY DEFINER helpers in non-exposed private schema with pinned search_path', () => {
    expect(migrationSql).toContain('CREATE SCHEMA IF NOT EXISTS private;');
    expect(migrationSql).toContain('CREATE OR REPLACE FUNCTION private.has_active_pro()');
    expect(migrationSql).toContain('CREATE OR REPLACE FUNCTION private.handle_new_user()');
    expect(migrationSql).toContain("SET search_path = ''");
    expect(migrationSql).toContain('DROP FUNCTION IF EXISTS public.has_active_pro(UUID);');
  });

  it('uses (SELECT auth.uid()) initPlan pattern and avoids unguarded public policies', () => {
    expect(migrationSql).toContain('(SELECT auth.uid())');
    expect(migrationSql).toContain('(SELECT private.has_active_pro())');
    expect(migrationSql).not.toContain('auth.role()');
    expect(migrationSql).not.toMatch(/CREATE POLICY[^;]+ON public\.certificates[^;]+USING\s*\(\s*true\s*\)/i);
  });

  it('defines FK indexes and unique constraints required for idempotent upserts', () => {
    expect(migrationSql).toContain('user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id)');
    expect(migrationSql).toContain('razorpay_payment_id TEXT UNIQUE NOT NULL');
    expect(migrationSql).toContain('CREATE INDEX IF NOT EXISTS idx_test_results_user_created');
    expect(migrationSql).toContain('CREATE INDEX IF NOT EXISTS idx_certificates_user');
  });

  it('enforces server-authoritative pricing in Razorpay order/verify edge functions', () => {
    const createOrderTs = readFileSync(
      resolve(process.cwd(), 'supabase/functions/create-order/index.ts'),
      'utf8'
    );
    const verifyPaymentTs = readFileSync(
      resolve(process.cwd(), 'supabase/functions/verify-payment/index.ts'),
      'utf8'
    );

    expect(createOrderTs).toContain('PLAN_PRICES_PAISE');
    expect(createOrderTs).not.toMatch(/const\s*\{\s*amount\b/);
    expect(verifyPaymentTs).toContain('https://api.razorpay.com/v1/payments/');
    expect(verifyPaymentTs).toContain('crypto.subtle');
  });
});
