import { useState } from 'react';
import type { PipelineResult, MerchantIntake, GeneratedDeal } from '@/lib/api';
import { IntakeForm } from './IntakeForm';
import { DealPreview } from './DealPreview';
import { Published } from './Published';

type FlowStep = 'intake' | 'preview' | 'published';

export function MerchantFlow() {
  const [step, setStep] = useState<FlowStep>('intake');
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [intake, setIntake] = useState<MerchantIntake | null>(null);
  const [finalDeal, setFinalDeal] = useState<GeneratedDeal | null>(null);

  function handleResult(r: PipelineResult, i: MerchantIntake) {
    setResult(r);
    setIntake(i);
    setFinalDeal(r.deal);
    setStep('preview');
  }

  function handlePublish() {
    setStep('published');
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
  }
}
