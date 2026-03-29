import { Outlet, Link } from 'react-router-dom';

export function MerchantLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Groupon-style header */}
      <header className="bg-[#2B1A6B]">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white">
            GROUPON
          </Link>
          <span className="text-sm text-white/70">Merchant Deal Creator</span>
        </div>
      </header>

      {/* Content */}
      <main>
        <Outlet />
      </main>

      {/* Simple footer */}
      <footer className="border-t bg-white py-6 text-center text-sm text-gray-400">
        AI-Powered Deal Creator — Prototype
      </footer>
    </div>
  );
}
