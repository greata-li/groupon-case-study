import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        {/* Hero */}
        <div className="mb-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#53A318]/10">
            <Sparkles className="h-8 w-8 text-[#53A318]" />
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
            Let's get your first deal live
          </h1>
          <p className="text-lg text-gray-500">
            Answer 5 quick questions about your business. Our AI will create a complete,
            publish-ready deal for you — no marketing expertise needed.
          </p>
        </div>

        {/* Value props */}
        <div className="mb-10 flex justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#53A318]" />
            Under 5 minutes
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#53A318]" />
            AI-powered
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#53A318]" />
            You review everything
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate('/create')}
          size="lg"
          className="h-14 rounded-full bg-[#53A318] px-12 text-lg font-semibold text-white hover:bg-[#478f15]"
        >
          Create My Deal
        </Button>

        <p className="mt-4 text-sm text-gray-400">
          Free to create. You only pay when customers buy.
        </p>
      </div>
    </div>
  );
}
