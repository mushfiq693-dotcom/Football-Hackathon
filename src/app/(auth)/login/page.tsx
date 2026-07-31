import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border/60 bg-card p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-2xl">
            ⚽
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Football Auction</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access real-time player auction rooms
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-4 text-sm text-muted-foreground">Loading login form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
