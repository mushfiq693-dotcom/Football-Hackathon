'use client';

import { useEffect, useState } from 'react';

export default function MyRegistrationPage() {
  const [registration, setRegistration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/registrations/list', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setRegistration(data.registrations[0]);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">My Registration</h1>
      {registration ? (
        <div className="border p-6 rounded-lg bg-card">
          <p>Status: {registration.status}</p>
          <p>Department: {registration.department}</p>
        </div>
      ) : (
        <p>No registration found.</p>
      )}
    </div>
  );
}
