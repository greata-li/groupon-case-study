import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, DollarSign, ClipboardList, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeStepProps {
  data: Record<string, unknown>;
  onUpdate: (field: string, value: unknown) => void;
  onNext: () => void;
}

const infoCards = [
  {
    icon: Clock,
    question: 'How long does it take?',
    answer: 'About 5 minutes to complete your business profile. You can save and come back anytime.',
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    icon: DollarSign,
    question: 'What does it cost?',
    answer: 'Free. No upfront cost, no subscription. You only pay a commission when customers purchase your deal.',
    accent: 'bg-green-50 text-groupon-green',
  },
  {
    icon: ClipboardList,
    question: 'What do I need?',
    answer: 'Basic business details like your address and description. Banking info is optional for now.',
    accent: 'bg-amber-50 text-amber-600',
  },
];

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="animate-fade-in-up">
      {/* Hero area */}
      <div className="mb-10">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-groupon-green/10 px-4 py-1.5 text-sm font-medium text-groupon-green">
          <Sparkles className="h-3.5 w-3.5" />
          New Merchant Setup
        </div>

        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
          Welcome to Groupon Merchant!
        </h1>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-gray-500">
          Let's set up your business profile. This takes about 5 minutes.
          Once complete, you'll be ready to create your first deal and start
          attracting new customers.
        </p>
      </div>

      {/* Info cards */}
      <div className="stagger-children grid gap-4 sm:grid-cols-3">
        {infoCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.question} className="border-gray-200 transition-all hover:border-groupon-green/20 hover:shadow-md hover:shadow-groupon-green/5">
              <CardContent className="pt-2">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-sm font-bold text-gray-900">
                  {card.question}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                  {card.answer}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-10">
        <Button
          onClick={onNext}
          className="group h-12 rounded-xl bg-groupon-green px-8 text-base font-bold text-white shadow-lg shadow-groupon-green/20 transition-all hover:bg-groupon-green-dark hover:shadow-xl hover:shadow-groupon-green/30"
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
