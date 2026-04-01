import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDeals, type PublishedDeal } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  Link2,
  Megaphone,
  Ticket,
  CreditCard,
  BarChart3,
  CheckCircle2,
  Circle,
  Headphones,
  Phone,
  ExternalLink,
  Loader2,
  Plus,
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  linkTo?: string;
  linkLabel?: string;
  completed: boolean;
  hasConnect?: boolean;
  duration?: string;
}

const ONBOARDING_ITEMS: ChecklistItem[] = [
  {
    id: 'booking',
    title: 'Connect a booking platform',
    description:
      'Do you use Booker, Mindbody or one of our other partners? Connect your account for a seamless experience.',
    hasConnect: true,
    duration: '5 min',
    completed: false,
  },
  {
    id: 'profile',
    title: 'Set up your business profile',
    linkTo: '/onboarding/profile',
    linkLabel: 'Set up profile',
    completed: false,
  },
  {
    id: 'campaign',
    title: 'Create your first campaign',
    linkTo: '/create',
    linkLabel: 'Create campaign',
    completed: false,
  },
  {
    id: 'voucher',
    title: 'Learn voucher redemption',
    description:
      'Understand how customers redeem vouchers and how you mark them as used.',
    completed: false,
  },
  {
    id: 'payments',
    title: 'Understand payments and refunds',
    description:
      'Learn how Groupon processes payments and handles customer refund requests.',
    completed: false,
  },
  {
    id: 'performance',
    title: 'Track campaign performance',
    description:
      'View real-time analytics on impressions, purchases, and revenue from your campaigns.',
    completed: false,
  },
];

const PROGRESS_STEPS = [
  { id: 'profile', label: 'Profile Setup', completed: true },
  { id: 'booking', label: 'Booking Connection', completed: false },
  { id: 'first-campaign', label: 'First Campaign', completed: false },
  { id: 'campaign-live', label: 'Campaign Live', completed: false },
  { id: 'first-sale', label: 'First Sale', completed: false },
  { id: 'first-redemption', label: 'First Redemption', completed: false },
  { id: 'first-payment', label: 'First Payment', completed: false },
];

export function PortalHome() {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<string | null>('booking');
  const [deals, setDeals] = useState<PublishedDeal[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(true);

  useEffect(() => {
    fetchDeals()
      .then(setDeals)
      .catch(() => {})
      .finally(() => setLoadingDeals(false));
  }, []);

  const completedCount = ONBOARDING_ITEMS.filter((i) => i.completed).length;
  const latestDeal = deals.length > 0 ? deals[0] : null;

  function toggleItem(id: string) {
    setExpandedItem((prev) => (prev === id ? null : id));
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Welcome banner */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Welcome to Groupon Merchant, Sofia!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete the steps below to get your business live on Groupon.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Onboarding checklist */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">
                    Onboarding checklist
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Take the first steps to sell on Groupon.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Incomplete Items</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {completedCount}/{ONBOARDING_ITEMS.length} steps completed
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full bg-groupon-green transition-all"
                  style={{
                    width: `${(completedCount / ONBOARDING_ITEMS.length) * 100}%`,
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {ONBOARDING_ITEMS.map((item, index) => {
                const isExpanded = expandedItem === item.id;
                const isLast = index === ONBOARDING_ITEMS.length - 1;
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-groupon-green shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300 shrink-0" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            item.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pl-12">
                        {item.description && (
                          <p className="text-sm text-gray-500 mb-3">
                            {item.description}
                          </p>
                        )}

                        {item.hasConnect && (
                          <div className="flex items-center gap-3">
                            <Button
                              className="rounded-lg bg-groupon-green text-white hover:bg-groupon-green-dark text-xs font-semibold"
                              size="sm"
                              onClick={() => navigate('/portal/connections')}
                            >
                              Connect
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg text-xs"
                            >
                              Skip for now
                            </Button>
                            {item.duration && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Duration: {item.duration}
                              </span>
                            )}
                          </div>
                        )}

                        {item.linkTo && (
                          <Button
                            className="rounded-lg bg-groupon-green text-white hover:bg-groupon-green-dark text-xs font-semibold"
                            size="sm"
                            onClick={() => navigate(item.linkTo!)}
                          >
                            {item.linkLabel}
                            <ExternalLink className="ml-1.5 h-3 w-3" />
                          </Button>
                        )}

                        {!item.hasConnect && !item.linkTo && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-xs"
                          >
                            Learn more
                            <ExternalLink className="ml-1.5 h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}

                    {!isLast && <Separator />}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right: Campaign card + Progress tracker */}
        <div className="space-y-6">
          {/* Your Campaign */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Your Campaign</CardTitle>
              <p className="text-xs text-muted-foreground">
                {latestDeal ? 'Your latest campaign' : "Here's your first campaign."}
              </p>
            </CardHeader>
            <CardContent>
              {loadingDeals ? (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : latestDeal ? (
                <div className="space-y-3">
                  <div className="rounded-lg border border-gray-200 p-3">
                    <h4 className="font-heading text-sm font-bold text-gray-900 truncate">
                      {latestDeal.deal?.title || 'Untitled Deal'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {latestDeal.intake?.business_name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-groupon-green/10 text-groupon-green border-0 text-xs">
                        {latestDeal.status}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(latestDeal.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-lg text-xs"
                    onClick={() => navigate('/portal/campaigns')}
                  >
                    View all campaigns
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <Plus className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    A campaign has yet to be created.
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    There is no campaign draft yet.
                  </p>
                  <Button
                    className="rounded-lg bg-groupon-green text-white hover:bg-groupon-green-dark text-xs font-semibold"
                    size="sm"
                    onClick={() => navigate('/create')}
                  >
                    Create your first campaign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {PROGRESS_STEPS.map((step, index) => {
                  const isLast = index === PROGRESS_STEPS.length - 1;
                  const isCurrent =
                    !step.completed &&
                    (index === 0 || PROGRESS_STEPS[index - 1].completed);
                  return (
                    <div key={step.id} className="flex gap-3 pb-4 last:pb-0">
                      {/* Vertical line + dot */}
                      <div className="flex flex-col items-center">
                        {step.completed ? (
                          <div className="h-5 w-5 rounded-full bg-groupon-green flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                        ) : isCurrent ? (
                          <div className="h-5 w-5 rounded-full border-2 border-groupon-green bg-white flex items-center justify-center shrink-0">
                            <div className="h-2 w-2 rounded-full bg-groupon-green" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-200 bg-white shrink-0" />
                        )}
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 mt-1 ${
                              step.completed ? 'bg-groupon-green' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>

                      {/* Label */}
                      <div className="pt-0.5">
                        {isCurrent ? (
                          <Badge className="bg-groupon-green text-white border-0 text-xs font-semibold">
                            {step.label}
                          </Badge>
                        ) : (
                          <span
                            className={`text-sm ${
                              step.completed
                                ? 'text-gray-900 font-medium'
                                : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom: Other Resources */}
      <Separator className="my-8" />
      <div className="mb-8">
        <h2 className="font-heading text-lg font-bold text-gray-900 mb-1">
          Other Resources
        </h2>
        <p className="text-sm text-muted-foreground">
          If you need support or documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support */}
        <Card>
          <CardContent className="flex flex-col items-start gap-3 pt-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <Headphones className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-gray-900">
                Support
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Everyone needs help sometimes. If you get stuck or need assistance
                with your Merchant onboarding experience, be sure to check out
                Merchant Help Center.
              </p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg text-xs">
              Visit
              <ExternalLink className="ml-1.5 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        {/* Contact Sales */}
        <Card>
          <CardContent className="flex flex-col items-start gap-3 pt-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <Phone className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-gray-900">
                Contact Sales Representative
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Have questions or need help? Click the button below, and we'll
                connect you with your dedicated Sales Representative.
              </p>
            </div>
            <Button
              className="rounded-lg bg-groupon-green text-white hover:bg-groupon-green-dark text-xs font-semibold"
              size="sm"
            >
              Request Assistance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
