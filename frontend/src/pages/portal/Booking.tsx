import { useState } from 'react';
import { markChecklistComplete } from '@/lib/checklist';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  CalendarDays,
  Users,
  Bell,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  Link as LinkIcon,
  RefreshCw,
  ArrowRight,
  KeyRound,
} from 'lucide-react';

interface CredentialField {
  key: string;
  label: string;
  placeholder: string;
}

interface PlatformConfig {
  fields: CredentialField[];
  signupUrl: string;
  signupLabel: string;
}

const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  booker: {
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'bkr_live_xxxxxxxxxxxx' },
      { key: 'locationId', label: 'Location ID', placeholder: 'LOC-12345' },
    ],
    signupUrl: 'https://www.booker.com',
    signupLabel: 'Booker',
  },
  mindbody: {
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'mb_api_xxxxxxxxxxxx' },
      { key: 'siteId', label: 'Site ID', placeholder: '-99999' },
      { key: 'sourceName', label: 'Source Name', placeholder: 'GrouponIntegration' },
    ],
    signupUrl: 'https://www.mindbodyonline.com',
    signupLabel: 'Mindbody',
  },
  square: {
    fields: [
      { key: 'accessToken', label: 'Access Token', placeholder: 'sq0atp-xxxxxxxxxxxx' },
      { key: 'locationId', label: 'Location ID', placeholder: 'LXXXXXXXXXXXXXXXXX' },
    ],
    signupUrl: 'https://squareup.com',
    signupLabel: 'Square',
  },
};

interface BookingPlatform {
  id: string;
  name: string;
  description: string;
  iconBg: string;
  connected: boolean;
  url: string;
}

const INITIAL_PLATFORMS: BookingPlatform[] = [
  {
    id: 'booker',
    name: 'Booker',
    description: 'Full-featured salon and spa management platform with online booking, POS, and client management.',
    iconBg: 'bg-purple-100',
    connected: false,
    url: 'https://www.booker.com',
  },
  {
    id: 'mindbody',
    name: 'Mindbody',
    description: 'Leading wellness software for fitness, beauty, and integrative health businesses.',
    iconBg: 'bg-blue-100',
    connected: false,
    url: 'https://www.mindbodyonline.com',
  },
  {
    id: 'square',
    name: 'Square',
    description: 'All-in-one business platform with appointments, payments, and marketing tools.',
    iconBg: 'bg-gray-100',
    connected: false,
    url: 'https://squareup.com',
  },
];

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Manage Your Calendar',
    description: 'Sync your availability with Groupon so customers can book during open time slots. No more double bookings.',
  },
  {
    icon: Users,
    title: 'Fill Empty Slots',
    description: 'Groupon sends customers your way when you have available appointments. Turn downtime into revenue.',
  },
  {
    icon: Bell,
    title: 'Notify Customers',
    description: 'Automatic appointment reminders reduce no-shows. Customers receive SMS and email confirmations.',
  },
  {
    icon: TrendingUp,
    title: 'Track Performance',
    description: 'See which time slots are most popular and optimize your schedule for maximum bookings.',
  },
];

export function Booking() {
  const [platforms, setPlatforms] = useState(INITIAL_PLATFORMS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [connectingId, setConnectingId] = useState<string | null>(null);

  function openConnectDialog(id: string) {
    setSelectedId(id);
    setCredentials({});
    setDialogOpen(true);
  }

  function handleConnect() {
    if (!selectedId) return;
    setDialogOpen(false);
    setConnectingId(selectedId);
    setTimeout(() => {
      setPlatforms((prev) =>
        prev.map((p) => (p.id === selectedId ? { ...p, connected: true } : p)),
      );
      setConnectingId(null);
      setSelectedId(null);
      markChecklistComplete('booking');
    }, 1500);
  }

  const selectedPlatform = platforms.find((p) => p.id === selectedId);
  const platformConfig = selectedId ? PLATFORM_CONFIGS[selectedId] : null;

  return (
    <div className="p-4 sm:p-6 max-w-7xl animate-fade-in-up">
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold text-gray-900">Booking</h1>
        <p className="mt-1 text-sm text-gray-500">
          Connect your booking platform to let Groupon customers schedule appointments directly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-groupon-green/10">
                    <Icon className="h-5 w-5 text-groupon-green" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator className="mb-8" />

      <h2 className="font-heading text-base font-bold text-gray-900 mb-4">Connect Your Platform</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {platforms.map((platform) => (
          <Card key={platform.id}>
            <CardContent>
              <div className="text-center py-2">
                <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${platform.iconBg}`}>
                  <span className="text-lg font-bold">{platform.name.charAt(0)}</span>
                </div>
                <h3 className="font-heading text-sm font-bold text-gray-900">{platform.name}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{platform.description}</p>
                {platform.connected ? (
                  <Badge className="mt-3 bg-groupon-green/10 text-groupon-green border-0 text-xs">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => openConnectDialog(platform.id)}
                      disabled={connectingId === platform.id}
                      className="rounded-lg bg-groupon-green text-xs font-bold text-white hover:bg-groupon-green-dark h-[30px]"
                    >
                      {connectingId === platform.id ? (
                        <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <KeyRound className="mr-1 h-3 w-3" />
                      )}
                      {connectingId === platform.id ? 'Connecting...' : 'Connect'}
                    </Button>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Get API Key
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Credential Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect {selectedPlatform?.name}</DialogTitle>
            <DialogDescription>
              Enter your {selectedPlatform?.name} credentials to connect your account.
            </DialogDescription>
          </DialogHeader>
          {platformConfig && (
            <div className="space-y-4 py-2">
              {platformConfig.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-xs font-medium">{field.label}</Label>
                  <Input
                    placeholder={field.placeholder}
                    value={credentials[field.key] ?? ''}
                    onChange={(e) =>
                      setCredentials((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="font-mono text-sm"
                  />
                </div>
              ))}
              <p className="text-xs text-gray-500 pt-1">
                Don't have an account?{' '}
                <a
                  href={platformConfig.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-groupon-green hover:underline font-medium"
                >
                  Sign up for {platformConfig.signupLabel}
                  <ExternalLink className="ml-1 inline h-3 w-3" />
                </a>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg text-xs"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConnect}
              className="rounded-lg bg-groupon-green text-xs font-bold text-white hover:bg-groupon-green-dark"
            >
              <LinkIcon className="mr-1 h-3 w-3" />
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="bg-gradient-to-r from-gray-900 to-gray-800">
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 py-2">
            <div className="flex-1">
              <Badge className="bg-white/10 text-white border-0 text-xs mb-2">
                Partner Offer
              </Badge>
              <h3 className="font-heading text-base font-bold text-white">
                Don't have a booking platform?
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                Get started with Square Appointments for free. Manage bookings, payments, and customer info all in one place.
              </p>
              <a
                href="https://squareup.com/appointments"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-xs font-bold text-gray-900 transition-colors hover:bg-gray-100"
              >
                Get Started with Square
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <span className="text-3xl font-extrabold text-white">S</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
