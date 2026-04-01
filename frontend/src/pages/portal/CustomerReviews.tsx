import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Loader2,
  MessageSquare,
  X,
} from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  text: string;
  campaign: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    customerName: 'Jennifer M.',
    rating: 5,
    date: '2026-03-25',
    text: 'Absolutely wonderful experience! The massage therapist was incredibly skilled and attentive. The ambiance was perfect and I felt completely relaxed afterward. Will definitely be coming back.',
    campaign: 'Up to 67% Off Full Body Massage',
  },
  {
    id: '2',
    customerName: 'David C.',
    rating: 4,
    date: '2026-03-22',
    text: 'Great service overall. The deep tissue massage was exactly what I needed after weeks of back pain. Only minor issue was a short wait at check-in, but the staff was very apologetic about it.',
    campaign: 'Up to 67% Off Full Body Massage',
  },
  {
    id: '3',
    customerName: 'Sarah T.',
    rating: 5,
    date: '2026-03-18',
    text: 'This was my first time using a Groupon for a spa service and I was blown away by the quality. The hot stone massage was heavenly. The therapist checked in regularly to make sure the pressure was right.',
    campaign: 'Up to 67% Off Full Body Massage',
  },
  {
    id: '4',
    customerName: 'Michael R.',
    rating: 2,
    date: '2026-03-15',
    text: 'The massage itself was decent but the facility was not very clean. The waiting area was crowded and the appointment started 20 minutes late. Expected better for the price.',
    campaign: 'Up to 67% Off Full Body Massage',
  },
  {
    id: '5',
    customerName: 'Emily W.',
    rating: 5,
    date: '2026-03-10',
    text: 'Best massage I have had in years! The couples package was such a great deal. Both therapists were professional and skilled. The room was beautifully set up with candles and soft music.',
    campaign: 'Up to 67% Off Full Body Massage',
  },
  {
    id: '6',
    customerName: 'James W.',
    rating: 4,
    date: '2026-03-05',
    text: 'Really enjoyed the Swedish massage. The therapist was knowledgeable and the pressure was perfect. Would have loved if the session was a bit longer but overall a fantastic experience.',
    campaign: 'Up to 67% Off Full Body Massage',
  },
  {
    id: '7',
    customerName: 'Lisa A.',
    rating: 1,
    date: '2026-02-28',
    text: 'Very disappointing experience. The therapist seemed rushed and barely communicated during the session. The room was cold and the table was uncomfortable. Would not recommend.',
    campaign: 'Up to 67% Off Full Body Massage',
  },
  {
    id: '8',
    customerName: 'Robert G.',
    rating: 5,
    date: '2026-02-22',
    text: 'Outstanding service from start to finish. Easy booking process, welcoming staff, and an incredibly relaxing massage. This place is a hidden gem. Already booked my next appointment!',
    campaign: 'Up to 67% Off Full Body Massage',
  },
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const iconSize = size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${iconSize} ${
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

const AI_RESPONSES: Record<string, string> = {
  '1': 'Thank you so much for your wonderful review, Jennifer! We are thrilled that you enjoyed your massage and found the ambiance relaxing. Our therapists take great pride in providing exceptional care. We look forward to welcoming you back!',
  '2': 'Thank you for your kind words, David! We are glad the deep tissue massage helped with your back pain. We sincerely apologize for the wait at check-in and are working to improve our scheduling. We hope to see you again soon!',
  '3': 'What a lovely review, Sarah! We are so happy your first Groupon spa experience exceeded expectations. Our hot stone massage is one of our most popular treatments. Thank you for trusting us with your relaxation!',
  '4': 'Thank you for your honest feedback, Michael. We take cleanliness and punctuality very seriously and apologize for falling short of your expectations. We have addressed these concerns with our team and would love the opportunity to provide you with a better experience.',
  '5': 'Thank you, Emily! We are delighted that you and your partner enjoyed the couples package. Creating a beautiful, relaxing atmosphere is something we put a lot of thought into. We appreciate you choosing us!',
  '6': 'Thank you for the great review, James! We are glad you enjoyed the Swedish massage and that the pressure was just right. We do offer extended sessions if you would like a longer experience next time. Hope to see you again!',
  '7': 'We sincerely apologize for your experience, Lisa. This is not the standard of service we strive for. We have spoken with our team about the importance of communication and comfort. We would like to offer you a complimentary session to make things right -- please reach out to us directly.',
  '8': 'What a wonderful testimonial, Robert! We are so grateful for your kind words. Our team works hard to make every visit special, and it is rewarding to hear it shows. We look forward to your next appointment!',
};

export function CustomerReviews() {
  const [activeTab, setActiveTab] = useState<'all' | 'positive' | 'negative'>('all');
  const [expandedAI, setExpandedAI] = useState<Record<string, boolean>>({});
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});

  const totalRatings = MOCK_REVIEWS.length;
  const avgRating = (
    MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / totalRatings
  ).toFixed(1);
  const positive = MOCK_REVIEWS.filter((r) => r.rating >= 4).length;
  const negative = MOCK_REVIEWS.filter((r) => r.rating <= 2).length;

  function filtered(): Review[] {
    if (activeTab === 'positive') return MOCK_REVIEWS.filter((r) => r.rating >= 4);
    if (activeTab === 'negative') return MOCK_REVIEWS.filter((r) => r.rating <= 2);
    return MOCK_REVIEWS;
  }

  function handleAISuggest(reviewId: string) {
    setLoadingAI((prev) => ({ ...prev, [reviewId]: true }));
    setExpandedAI((prev) => ({ ...prev, [reviewId]: true }));

    // Simulate AI response generation
    setTimeout(() => {
      setAiResponses((prev) => ({
        ...prev,
        [reviewId]:
          AI_RESPONSES[reviewId] ||
          'Thank you for your feedback! We truly appreciate you taking the time to share your experience. Your input helps us continue to improve our services.',
      }));
      setLoadingAI((prev) => ({ ...prev, [reviewId]: false }));
    }, 1200);
  }

  const reviews = filtered();

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Header */}
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">
        Customer Reviews
      </h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-2">
            <p className="text-xs text-muted-foreground mb-1">Average Star Rating</p>
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl font-extrabold text-gray-900">
                {avgRating}
              </span>
              <StarRating rating={Math.round(Number(avgRating))} size="md" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-2">
            <p className="text-xs text-muted-foreground mb-1">Total Ratings</p>
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl font-extrabold text-gray-900">
                {totalRatings}
              </span>
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-2">
            <p className="text-xs text-muted-foreground mb-1">Positive</p>
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl font-extrabold text-groupon-green">
                {positive}
              </span>
              <ThumbsUp className="h-5 w-5 text-groupon-green" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-2">
            <p className="text-xs text-muted-foreground mb-1">Negative</p>
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl font-extrabold text-red-500">
                {negative}
              </span>
              <ThumbsDown className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList variant="line" className="mb-6">
          <TabsTrigger value="all">All ({totalRatings})</TabsTrigger>
          <TabsTrigger value="positive">Positive ({positive})</TabsTrigger>
          <TabsTrigger value="negative">Negative ({negative})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="space-y-4">
            {reviews.map((review) => {
              const showAI = expandedAI[review.id];
              const isLoading = loadingAI[review.id];
              const response = aiResponses[review.id];

              return (
                <Card key={review.id}>
                  <CardContent className="pt-2">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-groupon-green/10 text-groupon-green font-bold text-sm">
                            {review.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {review.customerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {review.text}
                    </p>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {review.campaign}
                      </Badge>
                    </div>

                    <Separator className="my-3" />

                    {/* AI Response section */}
                    {!showAI ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs"
                        onClick={() => handleAISuggest(review.id)}
                      >
                        <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                        AI Suggest Response
                      </Button>
                    ) : (
                      <div className="rounded-lg border border-groupon-green/20 bg-groupon-green/5 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-xs font-semibold text-gray-700">
                              AI Suggested Response
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setExpandedAI((prev) => ({
                                ...prev,
                                [review.id]: false,
                              }))
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {isLoading ? (
                          <div className="flex items-center gap-2 py-4 justify-center text-gray-400">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-xs">
                              Generating response...
                            </span>
                          </div>
                        ) : (
                          <>
                            <Textarea
                              value={response || ''}
                              onChange={(e) =>
                                setAiResponses((prev) => ({
                                  ...prev,
                                  [review.id]: e.target.value,
                                }))
                              }
                              className="min-h-20 text-xs bg-white"
                            />
                            <div className="flex items-center justify-end gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-lg text-xs"
                                onClick={() => handleAISuggest(review.id)}
                              >
                                <Sparkles className="mr-1 h-3 w-3" />
                                Regenerate
                              </Button>
                              <Button
                                className="rounded-lg bg-groupon-green text-white hover:bg-groupon-green-dark text-xs font-semibold"
                                size="sm"
                              >
                                Post Response
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
