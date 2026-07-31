import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with the service role key.
 * WARNING: This bypasses RLS. Only use in server-side code (API routes, server actions).
 * NEVER import this in client components or expose the service role key.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
