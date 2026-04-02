import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Star, Sparkles, Loader2, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { enhanceText } from '@/lib/api';

interface MockReview {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  text: string;
  option: string;
}

const MOCK_REVIEWS: MockReview[] = [
  {
    id: '1',
    customerName: 'Sarah J.',
    rating: 5,
    date: '2026-03-25',
    text: 'Absolutely wonderful experience! The deep tissue massage was exactly what I needed. Sofia is incredibly skilled and the studio is beautifully decorated. Will definitely be back!',
    option: '60-Min Deep Tissue Massage',
  },
  {
    id: '2',
    customerName: 'Michael C.',
    rating: 4,
    date: '2026-03-22',
    text: 'Great facial treatment. My skin felt amazing afterwards. The only minor thing was the wait time was about 10 minutes longer than expected. Otherwise, excellent service and very professional.',
    option: 'Hydrating Facial Treatment',
  },
  {
    id: '3',
    customerName: 'Emily R.',
    rating: 5,
    date: '2026-03-20',
    text: 'The 90-minute spa package was pure bliss. From the aromatherapy to the hot stone massage, every detail was perfect. The organic products they use smell incredible. Best Groupon deal I have ever purchased!',
    option: '90-Min Spa Package',
  },
  {
    id: '4',
    customerName: 'David K.',
    rating: 2,
    date: '2026-03-18',
    text: 'Booking was a bit confusing and the studio was hard to find. The massage itself was okay but I have had better. Felt a bit rushed for a 60-minute session.',
    option: '60-Min Deep Tissue Massage',
  },
  {
    id: '5',
    customerName: 'Jessica M.',
    rating: 4,
    date: '2026-03-15',
    text: 'Lovely experience overall. The studio is clean and well-maintained. The facial was relaxing and my skin looked noticeably brighter. Good value with the Groupon discount.',
    option: 'Hydrating Facial Treatment',
  },
];

export function Reviews() {
  const [suggestingId, setSuggestingId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showResponseFor, setShowResponseFor] = useState<string | null>(null);

  const totalRatings = MOCK_REVIEWS.length;
  const avgRating = MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
  const positiveCount = MOCK_REVIEWS.filter((r) => r.rating >= 4).length;
  const negativeCount = MOCK_REVIEWS.filter((r) => r.rating <= 2).length;

  async function handleSuggestResponse(review: MockReview) {
    setSuggestingId(review.id);
    try {
      const result = await enhanceText(
        `Customer review (${review.rating} stars): "${review.text}"`,
        'review_response',
        { business_name: "Sofia's Glow Studio", rating: review.rating },
      );
      setResponses((prev) => ({ ...prev, [review.id]: result?.enhanced_text ?? 'Thank you for your feedback!' }));
      setShowResponseFor(review.id);
    } catch {
      setResponses((prev) => ({
        ...prev,
        [review.id]: review.rating >= 4
          ? `Thank you so much for your kind words, ${review.customerName}! We're thrilled you enjoyed your ${review.option}. We look forward to welcoming you back!`
          : `Thank you for your feedback, ${review.customerName}. We're sorry your experience didn't meet expectations. We'd love the opportunity to make it right -- please reach out to us directly so we can address your concerns.`,
      }));
      setShowResponseFor(review.id);
    } finally {
      setSuggestingId(null);
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
    );
  }

  function filterReviews(tab: string) {
    if (tab === 'positive') return MOCK_REVIEWS.filter((r) => r.rating >= 4);
    if (tab === 'negative') return MOCK_REVIEWS.filter((r) => r.rating <= 2);
    return MOCK_REVIEWS;
  }

  function renderReviewCard(review: MockReview) {
    return (
      <Card key={review.id} className="mb-4">
        <CardContent>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                {review.customerName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{review.customerName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {renderStars(review.rating)}
                  <span className="text-xs text-gray-400">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {review.option}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>

          {/* Response section */}
          <div className="mt-3 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestResponse(review)}
              disabled={suggestingId === review.id}
              className="rounded-lg text-xs"
            >
              {suggestingId === review.id ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="mr-1 h-3 w-3" />
              )}
              AI Suggest Response
            </Button>
            {responses[review.id] && showResponseFor !== review.id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResponseFor(review.id)}
                className="text-xs text-groupon-green"
              >
                Show Response
              </Button>
            )}
          </div>

          {showResponseFor === review.id && responses[review.id] && (
            <div className="mt-3 rounded-lg bg-groupon-green-light/30 border border-groupon-green/20 p-3">
              <p className="text-xs font-bold text-groupon-green mb-1.5">Suggested Response</p>
              <Textarea
                value={responses[review.id]}
                onChange={(e) =>
                  setResponses((prev) => ({ ...prev, [review.id]: (e.target as HTMLTextAreaElement).value }))
                }
                rows={3}
                className="bg-white text-sm"
              />
              <div className="mt-2 flex gap-2">
                <Button size="sm" className="rounded-lg bg-groupon-green text-xs font-bold text-white hover:bg-groupon-green-dark">
                  Post Response
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResponseFor(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl animate-fade-in-up">
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold text-gray-900">Customer Reviews</h1>
        <p className="mt-1 text-sm text-gray-500">See what customers are saying about your business.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Average Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-heading text-2xl font-extrabold text-gray-900">{avgRating.toFixed(1)}</span>
            {renderStars(Math.round(avgRating))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Total Ratings</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-heading text-2xl font-extrabold text-gray-900">{totalRatings}</span>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Positive</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-heading text-2xl font-extrabold text-groupon-green">{positiveCount}</span>
            <ThumbsUp className="h-4 w-4 text-groupon-green" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Negative</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-heading text-2xl font-extrabold text-red-500">{negativeCount}</span>
            <ThumbsDown className="h-4 w-4 text-red-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList variant="line">
          <TabsTrigger value="all">All ({totalRatings})</TabsTrigger>
          <TabsTrigger value="positive">Positive ({positiveCount})</TabsTrigger>
          <TabsTrigger value="negative">Negative ({negativeCount})</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="all">
            {filterReviews('all').map(renderReviewCard)}
          </TabsContent>
          <TabsContent value="positive">
            {filterReviews('positive').map(renderReviewCard)}
          </TabsContent>
          <TabsContent value="negative">
            {filterReviews('negative').length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">No negative reviews.</div>
            ) : (
              filterReviews('negative').map(renderReviewCard)
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
