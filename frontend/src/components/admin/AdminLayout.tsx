import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, FlaskConical, Database, ArrowLeft, Sparkles } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Endpoints', icon: LayoutDashboard, end: true },
  { to: '/admin/test', label: 'Test Panel', icon: FlaskConical },
  { to: '/admin/benchmarks', label: 'Benchmark Data', icon: Database },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-groupon-green" />
            <h1 className="font-heading text-base font-bold text-gray-900">
              Pipeline Admin
            </h1>
          </div>
          <Link
            to="/"
            className="ml-auto flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Merchant View
          </Link>
        </div>
      </header>

      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 px-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-groupon-green text-groupon-green'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
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
