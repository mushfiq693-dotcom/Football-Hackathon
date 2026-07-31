import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';

export const GET = requireAuth(async (_request, { user }) => {
  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
    },
    profile: user.profile,
  });
});
