'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validators/auth';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, type UserRole } from '@/stores/auth-store';
import Link from 'next/link';

export function RegisterForm() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('captain');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setProfile = useAuthStore((s) => s.setProfile);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: selectedRole,
          },
        },
      });

      if (authError) {
        setErrorMessage(authError.message);
        setIsSubmitting(false);
        return;
      }

      if (authData.user) {
        // Explicitly set profile role if trigger defaulted to viewer
        const { data: profile } = await supabase
          .from('profiles')
          .update({ role: selectedRole })
          .eq('id', authData.user.id)
          .select()
          .single();

        if (profile) {
          setProfile(profile);
        }
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      const errObj = err as Error;
      setErrorMessage(errObj?.message || 'Failed to register account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {errorMessage && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Role Selector Cards */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Select Account Role</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedRole('captain')}
            className={`rounded-lg border p-3 text-center transition ${
              selectedRole === 'captain'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                : 'border-border bg-card/40 text-muted-foreground hover:bg-card'
            }`}
          >
            <div className="text-lg">⚽</div>
            <div className="text-xs mt-1">Captain</div>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('auctioneer')}
            className={`rounded-lg border p-3 text-center transition ${
              selectedRole === 'auctioneer'
                ? 'border-purple-500 bg-purple-500/10 text-purple-300 font-semibold'
                : 'border-border bg-card/40 text-muted-foreground hover:bg-card'
            }`}
          >
            <div className="text-lg">🎙️</div>
            <div className="text-xs mt-1">Auctioneer</div>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('viewer')}
            className={`rounded-lg border p-3 text-center transition ${
              selectedRole === 'viewer'
                ? 'border-blue-500 bg-blue-500/10 text-blue-300 font-semibold'
                : 'border-border bg-card/40 text-muted-foreground hover:bg-card'
            }`}
          >
            <div className="text-lg">👀</div>
            <div className="text-xs mt-1">Viewer</div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <input
            {...register('full_name')}
            type="text"
            placeholder="Alex Morgan"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isSubmitting}
          />
          {errors.full_name && (
            <p className="text-xs text-red-400">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email Address</label>
          <input
            {...register('email')}
            type="email"
            placeholder="alex@example.com"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Confirm Password</label>
          <input
            {...register('confirm_password')}
            type="password"
            placeholder="••••••••"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isSubmitting}
          />
          {errors.confirm_password && (
            <p className="text-xs text-red-400">{errors.confirm_password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-emerald-400 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
