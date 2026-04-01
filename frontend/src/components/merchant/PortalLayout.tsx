import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchProfile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  House,
  Megaphone,
  Plus,
  Calendar,
  Ticket,
  Star,
  CreditCard,
  BarChart3,
  HelpCircle,
  Settings,
  Link as LinkIcon,
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
} from 'lucide-react';

interface NavChild {
  label: string;
  path: string;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { label: 'Home', icon: House, path: '/portal/home' },
  {
    label: 'Campaigns',
    icon: Megaphone,
    children: [
      { label: 'Active', path: '/portal/campaigns?tab=active' },
      { label: 'Drafts', path: '/portal/campaigns?tab=drafts' },
    ],
  },
  { label: 'Create Deal', icon: Plus, path: '/portal/create' },
  { label: 'Booking', icon: Calendar, path: '/portal/booking' },
  { label: 'Voucher List', icon: Ticket, path: '/portal/vouchers' },
  { label: 'Customer Reviews', icon: Star, path: '/portal/reviews' },
  { label: 'Payments', icon: CreditCard, path: '/portal/payments' },
  { label: 'Reports', icon: BarChart3, path: '/portal/reports' },
  { label: 'Support', icon: HelpCircle, path: '/portal/support' },
  { label: 'Admin', icon: Settings, path: '/admin' },
  { label: 'Connections', icon: LinkIcon, path: '/portal/connections' },
];

export function PortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['Campaigns']));
  const [businessName, setBusinessName] = useState('My Business');

  useEffect(() => {
    fetchProfile()
      .then((p) => {
        if (p?.business_name && typeof p.business_name === 'string') {
          setBusinessName(p.business_name);
        }
      })
      .catch(() => {});
  }, []);

  function toggleExpand(label: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  function isActive(path?: string) {
    if (!path) return false;
    const cleanPath = path.split('?')[0];
    return location.pathname === cleanPath || location.pathname.startsWith(cleanPath + '/');
  }

  function isChildActive(children?: NavChild[]) {
    if (!children) return false;
    return children.some((c) => location.pathname.startsWith(c.path.split('?')[0]));
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[240px] flex-col border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center px-5 border-b border-gray-100">
          <Link to="/portal/home" className="flex items-baseline gap-2">
            <span className="font-heading text-[1.4rem] font-extrabold tracking-[-0.02em] text-groupon-green">
              GROUPON
            </span>
            <span className="text-[11px] font-medium text-gray-400">Merchant</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path) || isChildActive(item.children);
              const expanded = expandedItems.has(item.label);

              return (
                <li key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-groupon-green-light text-groupon-green'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {expanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      {expanded && (
                        <ul className="ml-9 mt-0.5 space-y-0.5">
                          {item.children.map((child) => {
                            const childActive =
                              location.pathname + location.search === child.path ||
                              location.pathname === child.path.split('?')[0];
                            return (
                              <li key={child.label}>
                                <Link
                                  to={child.path}
                                  className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                                    childActive
                                      ? 'font-medium text-groupon-green'
                                      : 'text-gray-500 hover:text-gray-900'
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path ?? '/portal/home'}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-groupon-green-light text-groupon-green'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-groupon-green text-xs font-bold text-white">
              {businessName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{businessName}</p>
              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                <LogOut className="h-3 w-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-[240px] flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium text-gray-700">{businessName}</h2>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-gray-400">Merchant Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/portal/vouchers')}
              className="h-8 rounded-lg bg-groupon-green px-4 text-xs font-bold text-white hover:bg-groupon-green-dark"
            >
              Redeem
            </Button>
            <Button
              onClick={() => navigate('/portal/create')}
              variant="outline"
              className="h-8 rounded-lg px-4 text-xs font-medium"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              New Campaign
            </Button>
            <button className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200">
              <User className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
