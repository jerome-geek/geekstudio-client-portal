import { describe, expect, it } from 'vitest';
import { envSchema, publicEnvSchema, serverEnvSchema } from '@/shared/lib/env';

describe('envSchema', () => {
  it('requires all configured public and server keys', () => {
    const result = envSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('accepts a complete environment payload', () => {
    const result = envSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
      DOORAY_BASE_URL: 'https://api.dooray.example.com',
      DOORAY_API_TOKEN: 'dooray-token'
    });

    expect(result.success).toBe(true);
  });

  it('keeps public and server schemas separate', () => {
    expect(
      publicEnvSchema.safeParse({
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key'
      }).success
    ).toBe(true);

    expect(
      serverEnvSchema.safeParse({
        SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
        DOORAY_BASE_URL: 'https://api.dooray.example.com',
        DOORAY_API_TOKEN: 'dooray-token'
      }).success
    ).toBe(true);
  });
});
