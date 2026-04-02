import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, CheckCircle2, ArrowRight, TrendingUp, Zap, Target, Clock } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    fetchProfile()
      .then((p) => setIsOnboarded(Boolean(p?.onboarded)))
      .catch(() => setIsOnboarded(false));
  }, []);

  function handleCreateDeal() {
    if (isOnboarded) {
      navigate('/portal/create');
    } else {
      navigate('/onboarding');
    }
  }

  return (
    <div className="animate-fade-in-up">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-groupon-green-light/40 via-transparent to-groupon-purple/[0.03]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-groupon-green/10 px-4 py-1.5 text-sm font-medium text-groupon-green">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Merchant Platform
            </div>

            {/* Headline */}
            <h1 className="font-heading text-[2.75rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-gray-900 md:text-[3.5rem]">
              Get your first deal live
              <br />
              in <span className="text-groupon-green">under 5 minutes</span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-gray-500 md:text-xl">
              Just describe your business. Our AI builds your complete Groupon deal
              — pricing, copy, categories, fine print, everything. You review and publish.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center gap-3">
              <Button
                onClick={handleCreateDeal}
                size="lg"
                className="group h-14 rounded-full bg-groupon-green px-10 text-base font-bold text-white shadow-lg shadow-groupon-green/20 transition-all hover:bg-groupon-green-dark hover:shadow-xl hover:shadow-groupon-green/30"
              >
                {isOnboarded ? 'Create a New Deal' : 'Get Started'}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="text-sm text-gray-400">
                Free to create &middot; You only pay when customers buy
              </p>
              {isOnboarded && (
                <Button
                  variant="ghost"
                  onClick={() => navigate('/portal')}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  Go to Merchant Portal
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
          <h2 className="font-heading text-center text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            How it works
          </h2>

          <div className="stagger-children mt-12 grid gap-4 md:gap-8 md:grid-cols-3">
            <StepCard
              number="01"
              title="Tell us your story"
              description="Describe your business in your own words — type or use voice. Our AI captures your name, services, prices, and everything else."
              icon={<MessageCircle className="h-5 w-5" />}
            />
            <StepCard
              number="02"
              title="AI builds your deal"
              description="We classify your business, analyze your market, set optimal pricing, and write professional copy — all in seconds."
              icon={<Sparkles className="h-5 w-5" />}
            />
            <StepCard
              number="03"
              title="Review & publish"
              description="See exactly how customers will see your deal. Edit anything. Save as draft or go live with one click."
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-100 bg-noise bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <div className="grid gap-4 md:gap-8 md:grid-cols-3 text-center">
            <StatBlock
              icon={<Zap className="h-5 w-5 text-groupon-green" />}
              value="Under 5 min"
              label="From signup to published deal"
            />
            <StatBlock
              icon={<Target className="h-5 w-5 text-groupon-green" />}
              value="AI-optimized"
              label="Pricing based on market benchmarks"
            />
            <StatBlock
              icon={<CheckCircle2 className="h-5 w-5 text-groupon-green" />}
              value="70%+"
              label="Target: AI content accepted without edits"
            />
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">
            Compared to 45+ minutes for manual deal creation on Groupon's current platform
          </p>
        </div>
      </section>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative rounded-2xl border border-gray-100 bg-white p-7 transition-all hover:border-groupon-green/20 hover:shadow-lg hover:shadow-groupon-green/5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-groupon-green/10 text-groupon-green transition-colors group-hover:bg-groupon-green group-hover:text-white">
          {icon}
        </div>
        <span className="font-heading text-xs font-bold tracking-widest text-gray-400">
          STEP {number}
        </span>
      </div>
      <h3 className="font-heading text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}

function StatBlock({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {icon}
      <span className="font-heading text-3xl font-extrabold tracking-tight text-gray-900">
        {value}
      </span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}
