import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Link2, ArrowRight, Check } from 'lucide-react';

interface BookingStepProps {
  data: Record<string, unknown>;
  onUpdate: (field: string, value: unknown) => void;
}

type BookingChoice = 'none' | 'platform';

const platforms = [
  {
    id: 'mindbody',
    name: 'Mindbody',
    description: 'Popular with fitness studios, salons, and spas. Syncs classes, appointments, and client management.',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    iconBg: 'bg-indigo-100',
  },
  {
    id: 'booker',
    name: 'Booker',
    description: 'Full-featured salon and spa management with POS, appointment scheduling, and marketing tools.',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    iconBg: 'bg-cyan-100',
  },
  {
    id: 'square',
    name: 'Square Appointments',
    description: 'Simple scheduling and payment processing. Great for independent providers and small businesses.',
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    iconBg: 'bg-gray-100',
  },
];

export function BookingStep({ data, onUpdate }: BookingStepProps) {
  const [choice, setChoice] = useState<BookingChoice>(
    (data.booking_platform as BookingChoice) || 'none'
  );
  const [connectingId, setConnectingId] = useState<string | null>(null);

  function handleChoice(c: BookingChoice) {
    setChoice(c);
    onUpdate('booking_platform', c);
    if (c === 'none') {
      onUpdate('booking_provider', null);
    }
  }

  function handleConnect(platformId: string) {
    setConnectingId(platformId);
    // Prototype: show "coming soon" then reset after 2s
    setTimeout(() => setConnectingId(null), 2000);
  }

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-gray-900">
        Booking platform
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
        Connect your existing booking platform to automatically sync appointments from
        Groupon customers. This helps manage capacity and avoid double-booking.
      </p>

      {/* Two main choices */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {/* Without */}
        <button
          onClick={() => handleChoice('none')}
          className={`group relative flex flex-col rounded-xl border-2 p-6 text-left transition-all ${
            choice === 'none'
              ? 'border-groupon-green bg-groupon-green-light/30 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          {choice === 'none' && (
            <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-groupon-green">
              <Check className="h-3.5 w-3.5 text-white" />
            </div>
          )}
          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
            choice === 'none' ? 'bg-groupon-green/10 text-groupon-green' : 'bg-gray-100 text-gray-400'
          }`}>
            <Calendar className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-sm font-bold text-gray-900">
            Continue without a booking platform
          </h3>
          <p className="mt-1.5 text-sm text-gray-500">
            You'll manage appointments manually. You can connect a platform later from your dashboard.
          </p>
        </button>

        {/* With */}
        <button
          onClick={() => handleChoice('platform')}
          className={`group relative flex flex-col rounded-xl border-2 p-6 text-left transition-all ${
            choice === 'platform'
              ? 'border-groupon-green bg-groupon-green-light/30 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          {choice === 'platform' && (
            <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-groupon-green">
              <Check className="h-3.5 w-3.5 text-white" />
            </div>
          )}
          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
            choice === 'platform' ? 'bg-groupon-green/10 text-groupon-green' : 'bg-gray-100 text-gray-400'
          }`}>
            <Link2 className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-sm font-bold text-gray-900">
            Continue with a booking platform
          </h3>
          <p className="mt-1.5 text-sm text-gray-500">
            Connect an existing scheduling system to sync Groupon appointments automatically.
          </p>
        </button>
      </div>

      {/* Platform cards (shown when "with platform" is chosen) */}
      {choice === 'platform' && (
        <div className="stagger-children mt-8 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Choose a platform to connect:
          </p>
          {platforms.map((platform) => (
            <Card key={platform.id} className="border-gray-200 transition-all hover:shadow-sm">
              <CardContent className="flex items-center gap-4 py-1">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${platform.iconBg}`}>
                  <Link2 className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading text-sm font-bold text-gray-900">
                    {platform.name}
                  </h4>
                  <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                    {platform.description}
                  </p>
                </div>
                <div className="shrink-0">
                  {connectingId === platform.id ? (
                    <Badge className="bg-amber-100 text-amber-700 border-0 text-xs font-semibold">
                      Coming soon — prototype
                    </Badge>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnect(platform.id);
                      }}
                      variant="outline"
                      size="sm"
                      className="rounded-lg text-xs font-semibold"
                    >
                      <ArrowRight className="mr-1 h-3 w-3" />
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
