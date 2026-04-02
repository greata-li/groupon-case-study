import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, PartyPopper, Sparkles, Eye, LayoutDashboard } from 'lucide-react';
import type { GeneratedDeal, MerchantIntake } from '@/lib/api';

interface PublishedProps {
  deal: GeneratedDeal;
  intake: MerchantIntake;
}

export function Published({ deal, intake }: PublishedProps) {
  const navigate = useNavigate();
  const services = deal?.services || [];

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg text-center animate-fade-in-up">
        {/* Celebration */}
        <div className="relative mx-auto mb-8 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-groupon-green/10 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-2 rounded-full bg-groupon-green/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }} />
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-groupon-green">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
        </div>

        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-gray-900">
          Your deal is live!
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Customers in <span className="font-medium text-gray-700">{intake.location}</span> can
          now find your deal on Groupon.
        </p>

        {/* Deal summary */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-lg shadow-gray-900/[0.04]">
          <div className="bg-gradient-to-r from-groupon-green to-groupon-green-dark px-6 py-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Sparkles className="h-4 w-4" />
              AI-Generated Deal
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-heading text-lg font-bold text-gray-900">
              {deal?.title || 'Your Deal'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {intake.business_name} - {intake.location}
            </p>
            {services.length > 0 && (
              <div className="mt-4 space-y-2.5">
                {services.map((service, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5"
                  >
                    <span className="text-sm font-medium text-gray-700">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 line-through">
                        ${service.original_price}
                      </span>
                      <span className="font-heading font-extrabold text-groupon-green">
                        ${service.deal_price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* What's next */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-left">
          <h3 className="flex items-center gap-2 font-heading font-bold text-blue-900">
            <PartyPopper className="h-5 w-5" />
            What to expect next
          </h3>
          <ul className="mt-3 space-y-2.5">
            {[
              'Your deal appears in search results for your area',
              "You'll be notified when customers purchase",
              'Customers book directly with you to redeem',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-blue-700">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            onClick={() => navigate('/deals')}
            className="w-full h-12 rounded-xl bg-groupon-green font-bold text-white shadow-md shadow-groupon-green/20 hover:bg-groupon-green-dark"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Go to My Deals
          </Button>
          <Button
            onClick={() => navigate('/preview-deal')}
            variant="outline"
            className="w-full"
          >
            <Eye className="mr-2 h-4 w-4" />
            See How Customers See It
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-400 hover:text-gray-600"
            onClick={() => navigate('/create')}
          >
            Create Another Deal
          </Button>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          This is a prototype. In production, the deal would be live on groupon.com.
        </p>
      </div>
    </div>
  );
}
