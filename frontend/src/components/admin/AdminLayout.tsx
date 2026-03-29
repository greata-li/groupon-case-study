import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, FlaskConical, Database, ArrowLeft, Workflow } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Endpoints', icon: LayoutDashboard, end: true },
  { to: '/admin/test', label: 'Test Panel', icon: FlaskConical },
  { to: '/admin/benchmarks', label: 'Benchmark Data', icon: Database },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen surface-admin">
      {/* Header — dense, functional */}
      <header className="border-b border-[rgba(0,0,0,0.08)] bg-white">
        <div className="mx-auto flex h-12 max-w-7xl items-center px-6">
          {/* Left: back link */}
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-md border border-[rgba(0,0,0,0.08)] px-2.5 py-1 text-xs font-medium text-[#4b5563] transition-colors hover:bg-[rgba(0,0,0,0.02)] hover:text-[#111827]"
          >
            <ArrowLeft className="h-3 w-3" />
            Merchant View
          </Link>

          <div className="mx-3 h-4 w-px bg-[rgba(0,0,0,0.08)]" />

          {/* Center: title with pipeline icon */}
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4 text-groupon-green" />
            <span className="font-heading text-sm font-bold text-[#111827]">
              Pipeline Admin
            </span>
          </div>

          {/* Right: pipeline status */}
          <div className="ml-auto flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-groupon-green" />
            <span className="text-[11px] font-medium text-[#9ca3af]">4 endpoints active</span>
          </div>
        </div>
      </header>

      {/* Nav tabs — tight, functional */}
      <nav className="border-b border-[rgba(0,0,0,0.08)] bg-white">
        <div className="mx-auto flex max-w-7xl px-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'border-groupon-green text-groupon-green'
                    : 'border-transparent text-[#9ca3af] hover:text-[#4b5563]'
                }`
              }
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-5">
        <Outlet />
      </main>
    </div>
  );
}
