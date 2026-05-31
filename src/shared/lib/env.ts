import 'server-only';
import { z } from 'zod';

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1)
});

export const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DOORAY_BASE_URL: z.string().url(),
  DOORAY_API_TOKEN: z.string().min(1)
});

// Keep a merged schema for bootstrap-stage validation, but make the public/server
// boundary explicit so later client code does not import privileged secrets by accident.
export const envSchema = publicEnvSchema.merge(serverEnvSchema);

export type Env = z.infer<typeof envSchema>;
