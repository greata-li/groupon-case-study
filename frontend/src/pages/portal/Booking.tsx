import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CalendarDays,
  Users,
  Bell,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const PLATFORMS = [
  {
    name: 'Booker',
    description: 'Full-featured salon and spa management platform with online booking, POS, and client management.',
    color: 'bg-purple-50 text-purple-600',
    iconBg: 'bg-purple-100',
    connected: false,
    url: 'https://www.booker.com',
  },
  {
    name: 'Mindbody',
    description: 'Leading wellness software for fitness, beauty, and integrative health businesses.',
    color: 'bg-blue-50 text-blue-600',
    iconBg: 'bg-blue-100',
    connected: false,
    url: 'https://www.mindbodyonline.com',
  },
  {
    name: 'Square',
    description: 'All-in-one business platform with appointments, payments, and marketing tools.',
    color: 'bg-gray-50 text-gray-600',
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
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl animate-fade-in-up">
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold text-gray-900">Booking</h1>
        <p className="mt-1 text-sm text-gray-500">
          Connect your booking platform to let Groupon customers schedule appointments directly.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 mb-8">
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

      {/* Integration cards */}
      <div>
        <h2 className="font-heading text-base font-bold text-gray-900 mb-4">Connect Your Platform</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {PLATFORMS.map((platform) => (
            <Card key={platform.name}>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 rounded-lg text-xs"
                      render={<a href={platform.url} target="_blank" rel="noopener noreferrer" />}
                    >
                      Connect
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Square promo */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800">
        <CardContent>
          <div className="flex items-center gap-6 py-2">
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
              <Button
                size="sm"
                className="mt-4 rounded-lg bg-white text-gray-900 font-bold text-xs hover:bg-gray-100"
                render={<a href="https://squareup.com/appointments" target="_blank" rel="noopener noreferrer" />}
              >
                Get Started with Square
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
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
