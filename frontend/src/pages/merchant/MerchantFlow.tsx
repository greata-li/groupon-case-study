import { useState } from 'react';
import type { PipelineResult, MerchantIntake, GeneratedDeal } from '@/lib/api';
import { IntakeForm } from './IntakeForm';
import { DealPreview } from './DealPreview';
import { Published } from './Published';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

type FlowStep = 'intake' | 'preview' | 'published' | 'error';

export function MerchantFlow() {
  const [step, setStep] = useState<FlowStep>('intake');
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [intake, setIntake] = useState<MerchantIntake | null>(null);
  const [finalDeal, setFinalDeal] = useState<GeneratedDeal | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  function handleResult(r: PipelineResult, i: MerchantIntake) {
    // Validate that we got something usable
    if (!r?.deal || (typeof r.deal === 'object' && Object.keys(r.deal).length === 0)) {
      setErrorMsg(
        'The AI pipeline returned an empty result. This can happen with very short or generic input. Please try again with more detail about your business.',
      );
      setIntake(i);
      setStep('error');
      return;
    }
    setResult(r);
    setIntake(i);
    setFinalDeal(r.deal);
    setStep('preview');
  }

  function handlePublish() {
    setStep('published');
  }

  function handleStartOver() {
    setStep('intake');
    setResult(null);
    setIntake(null);
    setFinalDeal(null);
    setErrorMsg('');
  }

  switch (step) {
    case 'intake':
      return <IntakeForm onResult={handleResult} />;

    case 'preview':
      return result && intake ? (
        <DealPreview result={result} intake={intake} onPublish={handlePublish} />
      ) : null;

    case 'published':
      return finalDeal && intake ? (
        <Published deal={result?.deal ?? finalDeal} intake={intake} />
      ) : null;

    case 'error':
      return (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-gray-900">
              Couldn't generate your deal
            </h2>
            <p className="mt-3 text-gray-500">{errorMsg}</p>
            <Button
              onClick={handleStartOver}
              className="mt-8 h-12 rounded-xl bg-groupon-green px-8 font-bold text-white hover:bg-groupon-green-dark"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      );
  }
}
