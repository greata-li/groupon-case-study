import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, FlaskConical, Database, BarChart3, FileCode, ArrowLeft, Sparkles, ExternalLink } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Endpoints', icon: LayoutDashboard, end: true },
  { to: '/admin/test', label: 'Test Panel', icon: FlaskConical },
  { to: '/admin/benchmarks', label: 'Benchmark Data', icon: Database },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
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
          <div className="ml-auto flex items-center gap-2">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
            >
              <FileCode className="h-3.5 w-3.5" />
              API Docs
              <ExternalLink className="h-3 w-3" />
            </a>
            <Link
              to="/portal"
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Merchant Portal
            </Link>
          </div>
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
