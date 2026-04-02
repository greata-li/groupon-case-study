import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDeals, fetchProfile, type PublishedDeal } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  UserCircle,
  Calendar,
  Megaphone,
  Ticket,
  CreditCard,
  ArrowRight,
  Plus,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  linkTo: string;
  linkLabel: string;
  completed: boolean;
}

export function Home() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<PublishedDeal[]>([]);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChecklist, setExpandedChecklist] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      fetchDeals().catch(() => []),
      fetchProfile().catch(() => null),
    ]).then(([d, p]) => {
      setDeals(Array.isArray(d) ? d : []);
      setProfile(p);
      setLoading(false);
    });
  }, []);

  const hasProfile = Boolean(profile?.business_name);
  const hasDeal = deals.length > 0;
  const latestDeal = deals.length > 0 ? deals[0] : null;
  const completed = (profile?.checklist_completed as Record<string, boolean>) || {};

  const checklist: ChecklistItem[] = [
    {
      id: 'profile',
      title: 'Set up your business profile',
      description: 'Add your business name, description, address, and contact info so customers can find you.',
      linkTo: '/portal/profile',
      linkLabel: 'Complete Profile',
      completed: hasProfile,
    },
    {
      id: 'booking',
      title: 'Connect a booking platform',
      description: 'Integrate with Booker, Mindbody, or Square to manage appointments from Groupon customers.',
      linkTo: '/portal/connections',
      linkLabel: 'Connect Platform',
      completed: Boolean(completed.booking),
    },
    {
      id: 'campaign',
      title: 'Create your first campaign',
      description: 'Use our AI-powered deal builder to create a campaign in minutes. We handle pricing, copy, and categories.',
      linkTo: '/portal/create',
      linkLabel: 'Create Campaign',
      completed: hasDeal,
    },
    {
      id: 'voucher',
      title: 'Learn about voucher redemption',
      description: 'Understand how customers present vouchers and how you mark them as redeemed in your dashboard.',
      linkTo: '/portal/vouchers',
      linkLabel: 'View Vouchers',
      completed: Boolean(completed.voucher),
    },
    {
      id: 'payments',
      title: 'Understand payments and refunds',
      description: 'Payouts are processed weekly. Learn about the payment schedule and how refunds work.',
      linkTo: '/portal/payments',
      linkLabel: 'View Payments',
      completed: Boolean(completed.payments),
    },
  ];

  const completedCount = checklist.filter((c) => c.completed).length;

  const progressSteps = [
    { label: 'Profile Complete', done: hasProfile },
    { label: 'First Campaign', done: hasDeal },
    { label: 'Campaign Live', done: deals.some((d) => d.status === 'active') },
    { label: 'First Sale', done: false },
    { label: 'First Redemption', done: false },
  ];

  function toggleChecklist(id: string) {
    setExpandedChecklist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up p-4 sm:p-6 max-w-5xl">
      {/* Welcome banner */}
      <div className="rounded-xl bg-gradient-to-r from-groupon-green to-groupon-green-dark p-6 text-white mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium text-white/80">Getting Started</span>
        </div>
        <h1 className="font-heading text-2xl font-bold">Welcome to Groupon Merchant!</h1>
        <p className="mt-2 text-sm text-white/80 max-w-xl">
          Set up your business profile and create your first campaign. Our AI-powered tools make it easy to launch deals that attract new customers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Onboarding checklist */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">
                  Onboarding Checklist
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {completedCount}/{checklist.length} complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {checklist.map((item) => {
                  const isExpanded = expandedChecklist.has(item.id);
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggleChecklist(item.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-groupon-green" />
                        ) : (
                          <Circle className="h-5 w-5 shrink-0 text-gray-300" />
                        )}
                        <span className={`flex-1 text-sm font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {item.title}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 pl-12">
                          <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                          <Button
                            onClick={() => navigate(item.linkTo)}
                            size="sm"
                            className="rounded-lg bg-groupon-green text-xs font-bold text-white hover:bg-groupon-green-dark"
                          >
                            {item.linkLabel}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Your Campaign */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base font-bold">Your Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              {latestDeal ? (
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-groupon-green-light to-groupon-green/20 flex items-center justify-center">
                    <Megaphone className="h-7 w-7 text-groupon-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-sm font-bold text-gray-900 truncate">
                      {latestDeal.deal?.title ?? 'Untitled Deal'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {latestDeal.intake?.business_name ?? 'Unknown'} -- Created{' '}
                      {new Date(latestDeal.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <Badge className="mt-1.5 bg-groupon-green/10 text-groupon-green border-0 text-[11px] font-bold">
                      {latestDeal.status === 'active' ? 'Active' : (latestDeal.status ?? 'Draft')}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => navigate('/portal/campaigns')}
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-xs shrink-0"
                  >
                    View All
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-groupon-green/10">
                    <Plus className="h-5 w-5 text-groupon-green" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Create your first campaign</p>
                  <p className="text-xs text-gray-500 mt-1">AI builds your deal in under 5 minutes</p>
                  <Button
                    onClick={() => navigate('/portal/create')}
                    size="sm"
                    className="mt-4 rounded-lg bg-groupon-green text-xs font-bold text-white hover:bg-groupon-green-dark"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Create Campaign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: UserCircle, label: 'Profile', to: '/portal/profile' },
              { icon: Calendar, label: 'Booking', to: '/portal/booking' },
              { icon: Ticket, label: 'Vouchers', to: '/portal/vouchers' },
              { icon: CreditCard, label: 'Payments', to: '/portal/payments' },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-groupon-green/30 hover:shadow-sm"
                >
                  <Icon className="h-5 w-5 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right column - Progress tracker */}
        <div>
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base font-bold">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />

                <div className="space-y-6">
                  {progressSteps.map((step, i) => (
                    <div key={step.label} className="relative flex items-start gap-3">
                      {/* Dot */}
                      <div className="absolute -left-6 top-0.5">
                        {step.done ? (
                          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-groupon-green">
                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                          </div>
                        ) : (
                          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                            <span className="text-[10px] font-bold text-gray-400">{i + 1}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${step.done ? 'text-groupon-green' : 'text-gray-500'}`}>
                          {step.label}
                        </p>
                        {step.done && (
                          <span className="text-[11px] text-groupon-green/70">Completed</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
