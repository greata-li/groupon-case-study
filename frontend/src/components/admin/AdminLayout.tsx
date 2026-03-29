import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Settings, FlaskConical, Database } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Endpoints', icon: LayoutDashboard, end: true },
  { to: '/admin/test', label: 'Test Panel', icon: FlaskConical },
  { to: '/admin/benchmarks', label: 'Benchmark Data', icon: Database },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-6">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">AI Deal Creator — Admin</h1>
          <span className="ml-auto text-sm text-muted-foreground">Pipeline Management</span>
        </div>
      </header>

      {/* Nav */}
      <nav className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl gap-1 px-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
