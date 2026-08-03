'use client';

import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const { profile, isAdmin, isCaptain } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {profile?.full_name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-semibold">Role</h3>
          <p className="text-muted-foreground">{profile?.role}</p>
        </div>
        {isAdmin() && (
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-semibold">Admin Actions</h3>
            <p className="text-emerald-500">Manage all entities</p>
          </div>
        )}
        {isCaptain() && (
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-semibold">My Team</h3>
            <p className="text-emerald-500">Manage roster & budget</p>
          </div>
        )}
      </div>
    </div>
  );
}
