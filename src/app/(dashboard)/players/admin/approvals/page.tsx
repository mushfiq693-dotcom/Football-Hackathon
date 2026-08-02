'use client';

import { useEffect, useState } from 'react';

export default function AdminApprovalsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/registrations/list', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setRegistrations(data.registrations));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/registrations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      credentials: 'include',
    });
    // Refresh list
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Approvals</h1>
      <div className="grid gap-4">
        {registrations.map((reg: any) => (
          <div key={reg.id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <p>User: {reg.profiles?.full_name}</p>
              <p>Status: {reg.status}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => updateStatus(reg.id, 'approved')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              <button onClick={() => updateStatus(reg.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
