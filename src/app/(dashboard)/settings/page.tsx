'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { profile, signOut } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [notifications, setNotifications] = useState(profile?.notification_preferences || { auction_reminders: true, match_results: true });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  // Appearance Logic
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'system';
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
  }, []);

  const toggleTheme = (theme: string) => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
  };

  const updateProfile = async (data: any) => {
    setLoading(true);
    await fetch('/api/user/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    setLoading(false);
    alert('Settings updated');
  };

  const updatePassword = async () => {
    if (password.new !== password.confirm) return alert('Passwords do not match');
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: password.new });
    if (error) alert(error.message);
    else alert('Password updated');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile */}
      <section className="p-6 border rounded-lg bg-card space-y-4">
        <h2 className="text-xl font-semibold">Profile</h2>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 border rounded" placeholder="Full Name" />
        <button onClick={() => updateProfile({ full_name: fullName })} className="bg-primary text-white px-4 py-2 rounded">Save</button>
      </section>

      {/* Password */}
      <section className="p-6 border rounded-lg bg-card space-y-4">
        <h2 className="text-xl font-semibold">Security</h2>
        <input type="password" placeholder="New Password" onChange={(e) => setPassword({...password, new: e.target.value})} className="w-full p-2 border rounded" />
        <input type="password" placeholder="Confirm Password" onChange={(e) => setPassword({...password, confirm: e.target.value})} className="w-full p-2 border rounded" />
        <button onClick={updatePassword} className="bg-primary text-white px-4 py-2 rounded">Update Password</button>
      </section>

      {/* Appearance */}
      <section className="p-6 border rounded-lg bg-card space-y-4">
        <h2 className="text-xl font-semibold">Appearance</h2>
        <div className="flex gap-2">
          <button onClick={() => toggleTheme('light')} className="border px-4 py-2 rounded">Light</button>
          <button onClick={() => toggleTheme('dark')} className="border px-4 py-2 rounded">Dark</button>
        </div>
      </section>

      {/* Notifications */}
      <section className="p-6 border rounded-lg bg-card space-y-4">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={notifications.auction_reminders} onChange={() => {
            const next = {...notifications, auction_reminders: !notifications.auction_reminders};
            setNotifications(next);
            updateProfile({ notification_preferences: next });
          }} /> Auction Reminders
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={notifications.match_results} onChange={() => {
            const next = {...notifications, match_results: !notifications.match_results};
            setNotifications(next);
            updateProfile({ notification_preferences: next });
          }} /> Match Results
        </label>
      </section>

      {/* Session */}
      <section className="p-6 border rounded-lg bg-card">
        <h2 className="text-xl font-semibold mb-4">Session</h2>
        <p>Email: {profile?.email}</p>
        <p>Role: {profile?.role}</p>
        <button onClick={signOut} className="mt-4 text-red-500">Logout</button>
      </section>
    </div>
  );
}
