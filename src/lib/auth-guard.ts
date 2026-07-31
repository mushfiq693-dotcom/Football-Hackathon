import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { UserRole, Profile } from '@/stores/auth-store';

export interface AuthenticatedUser {
  id: string;
  email: string;
  profile: Profile;
}

export type RouteHandlerWithAuth = (
  request: NextRequest,
  context: { user: AuthenticatedUser; params: Record<string, string> }
) => Promise<NextResponse>;

/**
 * Higher-order function to secure API routes.
 * Validates JWT session via Supabase Auth and verifies profile roles.
 */
export function requireAuth(
  handler: RouteHandlerWithAuth,
  allowedRoles?: UserRole[]
) {
  return async (request: NextRequest, { params }: { params?: Promise<Record<string, string>> }) => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized: Valid JWT session required' },
          { status: 401 }
        );
      }

      // Fetch profile to verify role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: 'Forbidden: Profile not found' },
          { status: 403 }
        );
      }

      if (!profile.is_active) {
        return NextResponse.json(
          { error: 'Forbidden: Account is deactivated' },
          { status: 403 }
        );
      }

      // Role authorization check if roles specified
      if (allowedRoles && allowedRoles.length > 0) {
        const isSuperAdmin = profile.role === 'super_admin';
        const hasDirectRole = allowedRoles.includes(profile.role as UserRole);

        // Alias matching for Admin / Captain
        const isAdminMatch =
          allowedRoles.includes('admin') && (profile.role === 'admin' || profile.role === 'super_admin');
        const isCaptainMatch =
          allowedRoles.includes('captain') && (profile.role === 'captain' || profile.role === 'team_owner');

        if (!isSuperAdmin && !hasDirectRole && !isAdminMatch && !isCaptainMatch) {
          return NextResponse.json(
            {
              error: `Forbidden: Required role matching [${allowedRoles.join(', ')}]. Provided role: '${profile.role}'`,
            },
            { status: 403 }
          );
        }
      }

      const resolvedParams = params ? await params : {};

      return handler(request, {
        user: {
          id: user.id,
          email: user.email ?? profile.email,
          profile: profile as Profile,
        },
        params: resolvedParams,
      });
    } catch (err) {
      console.error('API Auth Guard Exception:', err);
      return NextResponse.json(
        { error: 'Internal Server Error during authentication' },
        { status: 500 }
      );
    }
  };
}
