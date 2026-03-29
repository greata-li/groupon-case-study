import { Outlet, Link } from 'react-router-dom';

export function MerchantLayout() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Slim prototype indicator */}
      <div className="bg-groupon-purple py-1.5 text-center text-xs font-medium text-white/70">
        Prototype Demo
      </div>

      {/* Groupon merchant header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-heading text-[1.65rem] font-extrabold tracking-[-0.02em] text-groupon-green">
              GROUPON
            </span>
            <span className="text-sm font-medium text-gray-400">for Merchants</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-gray-500">
            <Link to="/" className="transition-colors hover:text-gray-900">Home</Link>
            <Link to="/create" className="transition-colors hover:text-gray-900">Create Deal</Link>
            <Link
              to="/admin"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs transition-colors hover:bg-gray-50"
            >
              Admin Panel
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <span className="font-heading text-lg font-bold text-groupon-green">GROUPON</span>
          <p className="mt-1 text-xs text-gray-400">
            Merchant Deal Creator &middot; Case Study Prototype
          </p>
        </div>
      </footer>
    </div>
  );
}
