'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationInput } from '@/lib/validators/registration';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function RegistrationForm({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      tournament_id: tournamentId,
      department: '',
      session: '',
      position: 'midfielder',
      jersey_number: 1,
      preferred_foot: 'right',
      phone: '',
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: RegistrationInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit registration');
      }

      router.push('/players/my-registration');
      router.refresh();
    } catch (err: any) {
      console.error('Registration Form Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm text-red-500 bg-red-100 p-2 rounded">{error}</p>}
      
      {/* Add form fields for department, session, position, etc. */}
      {/* For brevity, I'll add a few essential ones */}
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Department</label>
        <input {...register('department')} className={cn("w-full p-2 border rounded-md")} />
        {errors.department && <p className="text-sm text-red-500">{errors.department.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
        Submit Registration
      </button>
    </form>
  );
}
