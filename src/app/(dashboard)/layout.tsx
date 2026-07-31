'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Tournaments', href: '/tournaments', icon: '🏆' },
  { label: 'Auctions', href: '/auctions', icon: '🔨' },
  { label: 'Teams', href: '/teams', icon: '⚽' },
  { label: 'Players', href: '/players', icon: '👟' },
  { label: 'Analytics', href: '/analytics', icon: '📈' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, signOut, isAdmin, isCaptain, isAuctioneer } = useAuth();

  const getRoleBadge = () => {
    if (isAdmin()) return { label: 'Admin', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    if (isAuctioneer()) return { label: 'Auctioneer', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    if (isCaptain()) return { label: 'Captain', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    return { label: 'Viewer', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
  };

  const badge = getRoleBadge();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card/40 lg:flex">
        <div className="p-6 border-b border-border/40">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-foreground">
            <span className="text-2xl">⚽</span>
            <span>Football Auction</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="m-3 rounded-lg border border-border bg-card p-3 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {profile?.full_name?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <div className="truncate text-sm font-semibold text-foreground">
                {profile?.full_name || 'Loading user...'}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {profile?.email || ''}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-semibold ${badge.color}`}>
              {badge.label}
            </span>
            <button
              onClick={signOut}
              className="text-xs font-medium text-red-400 hover:text-red-300 transition"
              title="Sign Out"
            >
              Log out
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-600/15 text-emerald-400 font-semibold'
                    : 'text-muted-foreground hover:bg-card hover:text-foreground'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-semibold ${badge.color}`}>
              Role: {badge.label}
            </span>
            <button
              onClick={signOut}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground transition"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="p-6 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
