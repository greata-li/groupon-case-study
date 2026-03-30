import { useNavigate } from 'react-router-dom';
import type { GeneratedDeal, MerchantIntake } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  MapPin,
  ArrowLeft,
  Camera,
  Share2,
  Heart,
  CheckCircle2,
  Clock,
  ShoppingCart,
} from 'lucide-react';

interface CustomerPreviewProps {
  deal: GeneratedDeal;
  intake: MerchantIntake;
}

export function CustomerPreview({ deal, intake }: CustomerPreviewProps) {
  const navigate = useNavigate();
  const services = deal?.services || [];
  const highlights = deal?.highlights || [];
  const finePrint =
    typeof deal?.fine_print === 'string'
      ? deal.fine_print
      : deal?.fine_print
        ? `Expires ${(deal.fine_print as any).expiry_days} days after purchase. Limit ${(deal.fine_print as any).max_per_person} per person. ${(deal.fine_print as any).new_customers_only ? 'New customers only.' : ''} ${(deal.fine_print as any).appointment_required ? 'Appointment required.' : ''}`
        : '';

  return (
    <div className="min-h-screen bg-white">
      {/* Groupon consumer header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <span className="font-heading text-2xl font-extrabold text-groupon-green">GROUPON</span>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Customer View</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="rounded-lg text-xs"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to Deal Builder
            </Button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-6 px-6 text-[13px] font-medium text-gray-500">
          {['Top Trending Deals', 'Beauty & Spas', 'Things To Do', 'Auto & Home', 'Food & Drink'].map((cat, i) => (
            <span
              key={cat}
              className={`border-b-2 py-2.5 ${i === 1 ? 'border-groupon-green text-groupon-green' : 'border-transparent'}`}
            >
              {cat}
            </span>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Prototype badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          This is a preview of how customers will see your deal
        </div>

        <div className="grid grid-cols-[1fr_400px] gap-8">
          {/* Left: Deal content */}
          <div className="space-y-5">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-400">
              Home &rsaquo; {(deal?.category || 'Beauty & Spas').replace(' > ', ' \u203A ')}
            </div>

            {/* Title */}
            <h1 className="text-[1.75rem] font-bold leading-snug text-gray-900">
              {deal?.title || 'Your Deal Title'}
            </h1>

            {/* Business info */}
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-groupon-green">{intake.business_name}</span>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <Star className="h-4 w-4 text-gray-300" />
              </div>
              <span className="text-gray-400">New Business</span>
            </div>

            {/* Image */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="flex h-80 items-center justify-center">
                <Camera className="h-16 w-16 text-gray-300" />
              </div>
              <div className="absolute right-4 top-4 flex gap-2">
                <div className="rounded-full bg-white p-2 shadow-sm">
                  <Share2 className="h-4 w-4 text-gray-500" />
                </div>
                <div className="rounded-full bg-white p-2 shadow-sm">
                  <Heart className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="rounded-lg bg-gray-50 p-5">
                <h3 className="font-bold text-gray-900 mb-3">Highlights</h3>
                <ul className="space-y-2">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-groupon-green" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-6 text-sm font-medium">
                <span className="border-b-2 border-groupon-green py-3 text-groupon-green">About</span>
                <span className="border-b-2 border-transparent py-3 text-gray-400">Need To Know</span>
                <span className="border-b-2 border-transparent py-3 text-gray-400">FAQs</span>
                <span className="border-b-2 border-transparent py-3 text-gray-400">Reviews</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg">About This Deal</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                {deal?.description || 'Deal description will appear here.'}
              </p>
            </div>

            {/* What's included */}
            {services.some((s) => s.description) && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3">What's Included</h3>
                {services.map((s, i) => s.description && (
                  <div key={i} className="mb-2 rounded-lg bg-gray-50 p-4">
                    <span className="font-semibold text-gray-900">{s.name}</span>
                    <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Fine print */}
            {finePrint && (
              <div className="rounded-lg bg-gray-50 p-5">
                <h3 className="font-bold text-gray-900 mb-2">Fine Print</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{finePrint}</p>
              </div>
            )}
          </div>

          {/* Right: Purchase sidebar */}
          <div>
            <div className="sticky top-4 space-y-4">
              {/* Urgency banner */}
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-center">
                <span className="text-sm font-medium text-red-600">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Limited time offer
                </span>
              </div>

              {/* Options */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-4">
                  <h3 className="font-bold text-gray-900">Select Option:</h3>
                </div>
                <div className="p-4 space-y-3">
                  {services.map((service, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                        i === 0 ? 'border-groupon-green bg-groupon-green-light/30' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded-full border-2 ${i === 0 ? 'border-groupon-green bg-groupon-green' : 'border-gray-300'}`}>
                          {i === 0 && <div className="flex h-full items-center justify-center"><div className="h-2 w-2 rounded-full bg-white" /></div>}
                        </div>
                        <span className="font-semibold text-gray-900">{service.name}</span>
                      </div>
                      <div className="mt-3 ml-8">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-gray-400 line-through">${service.original_price}</span>
                          <span className="text-2xl font-extrabold text-groupon-green">${service.deal_price}</span>
                        </div>
                        <Badge className="mt-1 bg-groupon-green/10 text-groupon-green border-0 font-bold">
                          {service.discount_pct}% Off
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 p-4 space-y-3">
                  <Button className="w-full h-12 rounded-xl bg-groupon-green text-base font-bold text-white hover:bg-groupon-green-dark">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl">
                    Buy As a Gift
                  </Button>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">{intake.business_name}</span>
                  <p className="text-xs text-gray-500">{intake.address || intake.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
