'use client';

import { useState } from 'react';
import { EventForm } from '@/components/forms/event-form';
import { CreateEventInput } from '@/lib/validators/event';

export default function EventsSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateEventInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      alert('Event created successfully');
      // In a real app, use toast here
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Event Settings</h1>
        <p className="text-muted-foreground">Manage your event configuration</p>
      </div>
      
      {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}
      
      <div className="border p-6 rounded-lg bg-card">
        <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
