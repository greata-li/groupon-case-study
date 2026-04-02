import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Settings,
} from 'lucide-react';

interface PlatformConnection {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  apiKey?: string;
}

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
  google: {
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'AIzaSyxxxxxxxxxxxx' },
    ],
    signupUrl: 'https://business.google.com',
    signupLabel: 'Google Business',
  },
  yelp: {
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'yelp_xxxxxxxxxxxx' },
      { key: 'businessId', label: 'Business ID', placeholder: 'your-business-name-city' },
    ],
    signupUrl: 'https://biz.yelp.com',
    signupLabel: 'Yelp',
  },
};

const PLATFORMS: PlatformConnection[] = [
  {
    id: 'booker',
    name: 'Booker',
    description: 'Salon and spa management platform. Syncs appointments and client data.',
    status: 'disconnected',
  },
  {
    id: 'mindbody',
    name: 'Mindbody',
    description: 'Wellness business software. Syncs class schedules, bookings, and client profiles.',
    status: 'disconnected',
  },
  {
    id: 'square',
    name: 'Square',
    description: 'All-in-one business tools. Syncs appointments, payments, and inventory.',
    status: 'disconnected',
  },
  {
    id: 'google',
    name: 'Google Business Profile',
    description: 'Keep your Google listing in sync with your Groupon deals and business hours.',
    status: 'disconnected',
  },
  {
    id: 'yelp',
    name: 'Yelp',
    description: 'Cross-post your deals and sync reviews between platforms.',
    status: 'disconnected',
  },
];

export function Connections() {
  const [platforms, setPlatforms] = useState(PLATFORMS);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  function openConnectDialog(id: string) {
    setSelectedPlatformId(id);
    setCredentials({});
    setDialogOpen(true);
  }

  function handleDialogConnect() {
    if (!selectedPlatformId) return;
    setDialogOpen(false);
    setConnectingId(selectedPlatformId);
    // Simulate connection
    setTimeout(() => {
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === selectedPlatformId
            ? { ...p, status: 'connected' as const, lastSync: new Date().toISOString() }
            : p,
        ),
      );
      setConnectingId(null);
      setSelectedPlatformId(null);
    }, 1500);
  }

  function handleDisconnect(id: string) {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'disconnected' as const, lastSync: undefined } : p,
      ),
    );
  }

  function statusIcon(status: string) {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-4 w-4 text-groupon-green" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  }

  function statusBadge(status: string) {
    switch (status) {
      case 'connected':
        return 'bg-groupon-green/10 text-groupon-green border-0';
      case 'error':
        return 'bg-red-50 text-red-500 border-0';
      default:
        return 'bg-gray-100 text-gray-500 border-0';
    }
  }

  const connectedCount = platforms.filter((p) => p.status === 'connected').length;
  const selectedPlatform = platforms.find((p) => p.id === selectedPlatformId);
  const platformConfig = selectedPlatformId ? PLATFORM_CONFIGS[selectedPlatformId] : null;

  return (
    <div className="p-6 max-w-5xl animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-gray-900">Connections</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage integrations with your existing business tools.
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {connectedCount}/{platforms.length} connected
        </Badge>
      </div>

      {/* Connection cards */}
      <div className="space-y-4">
        {platforms.map((platform) => (
          <Card key={platform.id}>
            <CardContent>
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <span className="text-lg font-bold text-gray-500">{platform.name.charAt(0)}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{platform.name}</h3>
                    <Badge className={`text-[10px] font-bold capitalize ${statusBadge(platform.status)}`}>
                      {platform.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{platform.description}</p>
                  {platform.lastSync && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      Last synced: {new Date(platform.lastSync).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {platform.status === 'connected' ? (
                    <>
                      <Button variant="ghost" size="icon-sm" title="Sync now">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Settings">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(platform.id)}
                        className="rounded-lg text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => openConnectDialog(platform.id)}
                      disabled={connectingId === platform.id}
                      className="rounded-lg bg-groupon-green text-xs font-bold text-white hover:bg-groupon-green-dark"
                    >
                      {connectingId === platform.id ? (
                        <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <LinkIcon className="mr-1 h-3 w-3" />
                      )}
                      {connectingId === platform.id ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </div>
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
              onClick={handleDialogConnect}
              className="rounded-lg bg-groupon-green text-xs font-bold text-white hover:bg-groupon-green-dark"
            >
              <LinkIcon className="mr-1 h-3 w-3" />
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Key section */}
      <Card className="mt-8">
        <CardHeader className="border-b">
          <CardTitle className="text-sm font-bold">API Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 mb-3">
            Use the Groupon Merchant API to build custom integrations with your systems.
          </p>
          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-sm">
              <Label className="text-xs">API Key</Label>
              <Input
                value="grp_sk_****************************3a7f"
                readOnly
                className="mt-1 bg-gray-50 font-mono text-xs"
              />
            </div>
            <Button variant="outline" size="sm" className="rounded-lg text-xs">
              Regenerate
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg text-xs">
              <ExternalLink className="mr-1 h-3 w-3" />
              API Docs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
