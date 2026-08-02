'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTournamentSchema, type CreateTournamentInput } from '@/lib/validators/tournament';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function TournamentForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateTournamentInput>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      status: 'Draft',
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: CreateTournamentInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(initialData ? `/api/tournaments/${initialData.id}` : '/api/tournaments', {
        method: initialData ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(initialData ? 'Failed to update tournament' : 'Failed to create tournament');
      }

      router.push('/tournaments');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm text-red-500 bg-red-100 p-2 rounded">{error}</p>}
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Tournament Name</label>
        <input {...register('name')} className={cn("w-full p-2 border rounded-md", errors.name && "border-red-500")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea {...register('description')} className="w-full p-2 border rounded-md" />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
        {initialData ? 'Update Tournament' : 'Create Tournament'}
      </button>
    </form>
  );
}
