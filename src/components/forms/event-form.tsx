import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEventSchema, type CreateEventInput } from '@/lib/validators/event';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EventFormProps {
  initialData?: Partial<CreateEventInput>;
  onSubmit: (data: CreateEventInput) => Promise<void>;
  isLoading: boolean;
}

export function EventForm({ initialData, onSubmit, isLoading }: EventFormProps) {
  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: initialData || {
      event_name: '',
      academic_session: '',
      department: '',
      tournament_name: '',
      logo_url: '',
      description: '',
      is_active: true,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Event Name</label>
          <input
            {...register('event_name')}
            className={cn("w-full p-2 border rounded-md", errors.event_name && "border-red-500")}
          />
          {errors.event_name && <p className="text-sm text-red-500">{errors.event_name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Academic Session</label>
          <input
            {...register('academic_session')}
            className={cn("w-full p-2 border rounded-md", errors.academic_session && "border-red-500")}
          />
          {errors.academic_session && <p className="text-sm text-red-500">{errors.academic_session.message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
          <label className="text-sm font-medium">Department</label>
          <input
            {...register('department')}
            className={cn("w-full p-2 border rounded-md", errors.department && "border-red-500")}
          />
          {errors.department && <p className="text-sm text-red-500">{errors.department.message}</p>}
      </div>

      <div className="space-y-2">
          <label className="text-sm font-medium">Tournament Name</label>
          <input
            {...register('tournament_name')}
            className={cn("w-full p-2 border rounded-md", errors.tournament_name && "border-red-500")}
          />
          {errors.tournament_name && <p className="text-sm text-red-500">{errors.tournament_name.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 p-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
      >
        {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
        {initialData ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
}
