import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ExternalLink, BarChart3, ArrowRight } from 'lucide-react';
import type { GeneratedDeal, MerchantIntake } from '@/lib/api';

interface PublishedProps {
  deal: GeneratedDeal;
  intake: MerchantIntake;
}

export function Published({ deal, intake }: PublishedProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#53A318]/10">
          <CheckCircle2 className="h-10 w-10 text-[#53A318]" />
        </div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">Your deal is live!</h1>
        <p className="mb-8 text-lg text-gray-500">
          Customers in {intake.location} can now find your deal on Groupon.
        </p>

        {/* Deal summary card */}
        <Card className="mb-8 text-left">
          <CardContent className="py-6">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">{deal.title}</h3>
            <p className="mb-4 text-sm text-gray-500">{intake.business_name} — {intake.location}</p>
            <div className="space-y-2">
              {deal.services.map((service, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 line-through">${service.original_price}</span>
                    <span className="font-semibold text-[#53A318]">${service.deal_price}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What's next */}
        <Card className="mb-8 border-blue-100 bg-blue-50 text-left">
          <CardContent className="py-6">
            <h3 className="mb-3 font-semibold text-blue-900">What to expect in the next 48 hours</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                Your deal will appear in search results for your area and category
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                You'll receive notifications when customers purchase your deal
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                Customers will book appointments directly with you to redeem
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View My Deal (prototype)
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-400"
            onClick={() => navigate('/create')}
          >
            Create Another Deal
          </Button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          This is a prototype. In production, the deal would be live on groupon.com.
        </p>
      </div>
    </div>
  );
}
