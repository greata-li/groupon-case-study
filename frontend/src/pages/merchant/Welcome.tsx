import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Clock, CheckCircle2, ArrowRight, TrendingUp, Users } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in-up">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-white">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-groupon-green-light/40 via-transparent to-groupon-purple/[0.03]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-groupon-green/10 px-4 py-1.5 text-sm font-medium text-groupon-green">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Deal Creation
            </div>

            {/* Headline */}
            <h1 className="font-heading text-[2.75rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-gray-900 md:text-[3.5rem]">
              Get your first deal live
              <br />
              in <span className="text-groupon-green">5 minutes</span>
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-gray-500 md:text-xl">
              Tell us about your business. Our AI handles the rest &mdash;
              pricing, copy, category, everything. You review and publish.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center gap-3">
              <Button
                onClick={() => navigate('/onboarding')}
                size="lg"
                className="group h-14 rounded-full bg-groupon-green px-10 text-base font-bold text-white shadow-lg shadow-groupon-green/20 transition-all hover:bg-groupon-green-dark hover:shadow-xl hover:shadow-groupon-green/30"
              >
                Create My Deal
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="text-sm text-gray-400">
                Free to create &middot; You only pay when customers buy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-heading text-center text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            How it works
          </h2>

          <div className="stagger-children mt-12 grid gap-8 md:grid-cols-3">
            <StepCard
              number="01"
              title="Answer 5 questions"
              description="Your business name, what you do, location, services & prices. Takes about 2 minutes."
              icon={<Clock className="h-5 w-5" />}
            />
            <StepCard
              number="02"
              title="AI creates your deal"
              description="We analyze your market, set the right discount, write the copy, and structure everything."
              icon={<Sparkles className="h-5 w-5" />}
            />
            <StepCard
              number="03"
              title="Review & publish"
              description="See exactly how customers will see your deal. Edit anything you want. One click to go live."
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* Social proof / stats (synthetic) */}
      <section className="border-t border-gray-100 bg-noise bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <StatBlock
              icon={<TrendingUp className="h-5 w-5 text-groupon-green" />}
              value="2x"
              label="Faster than manual deal creation"
            />
            <StatBlock
              icon={<Users className="h-5 w-5 text-groupon-green" />}
              value="35-40%"
              label="Recommended discount for Beauty & Spas"
            />
            <StatBlock
              icon={<CheckCircle2 className="h-5 w-5 text-groupon-green" />}
              value="70%+"
              label="AI fields accepted without edits"
            />
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">
            Based on synthetic benchmark data for Beauty & Spas in Chicago
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
        <span className="font-heading text-xs font-bold tracking-widest text-gray-300">
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
