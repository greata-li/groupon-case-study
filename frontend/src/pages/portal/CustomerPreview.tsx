import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDeal, type PublishedDeal } from '@/lib/api';
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
  Loader2,
} from 'lucide-react';

export function CustomerPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dealData, setDealData] = useState<PublishedDeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('No deal ID provided');
      setLoading(false);
      return;
    }
    fetchDeal(id)
      .then(setDealData)
      .catch(() => setError('Failed to load deal'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading preview...
      </div>
    );
  }

  if (error || !dealData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-gray-500">{error || 'Deal not found'}</p>
        <Button
          variant="outline"
          onClick={() => navigate('/portal/campaigns')}
          className="mt-4 rounded-lg text-xs"
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back to Campaigns
        </Button>
      </div>
    );
  }

  const deal = dealData.deal;
  const intake = dealData.intake;
  const services = deal?.services ?? [];
  const highlights = deal?.highlights ?? [];
  const finePrint =
    typeof deal?.fine_print === 'string'
      ? deal.fine_print
      : deal?.fine_print
        ? `Expires ${(deal.fine_print as Record<string, unknown>).expiry_days ?? 90} days after purchase. Limit ${(deal.fine_print as Record<string, unknown>).max_per_person ?? 1} per person.${(deal.fine_print as Record<string, unknown>).new_customers_only ? ' New customers only.' : ''}${(deal.fine_print as Record<string, unknown>).appointment_required ? ' Appointment required.' : ''}`
        : '';

  return (
    <div className="animate-fade-in-up">
      {/* Consumer header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
          <span className="font-heading text-xl font-extrabold text-groupon-green">GROUPON</span>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              Customer Preview
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="rounded-lg text-xs"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back
            </Button>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl gap-6 px-6 text-[13px] font-medium text-gray-500">
          {['Top Trending Deals', 'Beauty & Spas', 'Things To Do', 'Auto & Home', 'Food & Drink'].map((cat, i) => (
            <span
              key={cat}
              className={`border-b-2 py-2 ${i === 1 ? 'border-groupon-green text-groupon-green' : 'border-transparent'}`}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 lg:gap-8">
          {/* Left: Deal content */}
          <div className="space-y-5">
            {/* Breadcrumb */}
            <div className="text-xs text-gray-400">
              Home &rsaquo; {(deal?.category ?? 'Beauty & Spas').replace(' > ', ' > ')}
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl font-bold leading-snug text-gray-900">
              {deal?.title ?? 'Your Deal Title'}
            </h1>

            {/* Business info */}
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-groupon-green">{intake?.business_name ?? 'Business'}</span>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
                <Star className="h-3.5 w-3.5 text-gray-300" />
              </div>
              <span className="text-xs text-gray-400">New Business</span>
            </div>

            {/* Image */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="flex h-72 items-center justify-center">
                <Camera className="h-14 w-14 text-gray-300" />
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
                {deal?.description ?? 'Deal description will appear here.'}
              </p>
            </div>

            {/* What's included */}
            {services.some((s) => s.description) && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3">What's Included</h3>
                {services.map((s, i) =>
                  s.description ? (
                    <div key={i} className="mb-2 rounded-lg bg-gray-50 p-4">
                      <span className="font-semibold text-gray-900">{s.name}</span>
                      <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                    </div>
                  ) : null,
                )}
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
            <div className="sticky top-20 space-y-4">
              {/* Urgency banner */}
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-center">
                <span className="text-sm font-medium text-red-600">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Limited time offer
                </span>
              </div>

              {/* Options */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <div className="border-b border-gray-100 px-5 py-3">
                  <h3 className="font-bold text-gray-900 text-sm">Select Option:</h3>
                </div>
                <div className="p-3 space-y-2">
                  {services.map((service, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border-2 p-3 cursor-pointer transition-all ${
                        i === 0
                          ? 'border-groupon-green bg-groupon-green-light/30'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-full border-2 ${
                            i === 0 ? 'border-groupon-green bg-groupon-green' : 'border-gray-300'
                          }`}
                        >
                          {i === 0 && (
                            <div className="flex h-full items-center justify-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{service.name}</span>
                      </div>
                      <div className="mt-2 ml-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-gray-400 line-through">${service.original_price}</span>
                          <span className="text-xl font-extrabold text-groupon-green">${service.deal_price}</span>
                        </div>
                        <Badge className="mt-1 bg-groupon-green/10 text-groupon-green border-0 text-[11px] font-bold">
                          {service.discount_pct}% Off
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 p-3 space-y-2">
                  <Button className="w-full h-11 rounded-xl bg-groupon-green text-sm font-bold text-white hover:bg-groupon-green-dark">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl text-sm">
                    Buy As a Gift
                  </Button>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-700">{intake?.business_name ?? ''}</span>
                  <p className="text-xs text-gray-500">{intake?.address ?? intake?.location ?? ''}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
