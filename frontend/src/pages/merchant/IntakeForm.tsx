import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateDeal, type MerchantIntake, type PipelineResult } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const steps = [
  {
    field: 'business_name' as const,
    label: "What's your business name?",
    placeholder: "e.g., Sofia's Studio",
    hint: "The name customers will see on your deal.",
    type: 'input',
  },
  {
    field: 'business_description' as const,
    label: 'What do you do?',
    placeholder: "e.g., Waxing and lash services, two-chair studio, 12 years experience",
    hint: "Tell us about your business in a sentence or two. What services do you offer? What makes you special?",
    type: 'textarea',
  },
  {
    field: 'location' as const,
    label: 'Where are you located?',
    placeholder: "e.g., Lincoln Park, Chicago",
    hint: "City or neighborhood — helps us find the right customers near you.",
    type: 'input',
  },
  {
    field: 'services' as const,
    label: 'What services do you want to offer, and what do you normally charge?',
    placeholder: "e.g., Brazilian Wax $65, Lash Lift $85, Wax + Lash Bundle $140",
    hint: "List your services with regular prices. We'll recommend the right deal pricing.",
    type: 'textarea',
  },
  {
    field: 'additional_info' as const,
    label: 'Anything else customers should know?',
    placeholder: "e.g., Loyal regulars, slow Tuesdays and Wednesdays, parking available",
    hint: "Optional — hours, specialties, what days you want to fill. This helps us tailor your deal.",
    type: 'textarea',
  },
];

interface IntakeFormProps {
  onResult: (result: PipelineResult, intake: MerchantIntake) => void;
}

export function IntakeForm({ onResult }: IntakeFormProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<MerchantIntake>({
    business_name: '',
    business_description: '',
    location: '',
    services: '',
    additional_info: '',
  });

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canAdvance =
    step.field === 'additional_info'
      ? true // optional
      : form[step.field].trim().length > 0;

  function handleNext() {
    if (isLastStep) {
      handleGenerate();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep === 0) {
      navigate('/');
    } else {
      setCurrentStep((s) => s - 1);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey && step.type === 'input') {
      e.preventDefault();
      if (canAdvance) handleNext();
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateDeal(form);
      onResult(result, form);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setGenerating(false);
    }
  }

  // Loading / generating state
  if (generating) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#53A318]/10">
            <Loader2 className="h-8 w-8 animate-spin text-[#53A318]" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Creating your deal...</h2>
          <p className="text-gray-500">
            Our AI is analyzing your business, checking market data, and generating a
            complete deal tailored to you. This takes about 10 seconds.
          </p>

          {/* Pipeline steps indicator */}
          <div className="mt-8 space-y-3 text-left">
            <PipelineStepIndicator label="Classifying your business" />
            <PipelineStepIndicator label="Analyzing market data" />
            <PipelineStepIndicator label="Generating your deal" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
            <span>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#53A318] transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <Label className="mb-2 block text-xl font-semibold text-gray-900">
              {step.label}
            </Label>
            <p className="mb-6 text-sm text-gray-500">{step.hint}</p>

            {step.type === 'input' ? (
              <Input
                autoFocus
                value={form[step.field]}
                onChange={(e) => setForm({ ...form, [step.field]: e.target.value })}
                onKeyDown={handleKeyDown}
                placeholder={step.placeholder}
                className="h-12 text-lg"
              />
            ) : (
              <Textarea
                autoFocus
                value={form[step.field]}
                onChange={(e) => setForm({ ...form, [step.field]: e.target.value })}
                placeholder={step.placeholder}
                className="min-h-[120px] text-base"
              />
            )}

            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <Button variant="ghost" onClick={handleBack} className="text-gray-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canAdvance}
                className="h-11 bg-[#53A318] px-8 font-semibold text-white hover:bg-[#478f15]"
              >
                {isLastStep ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate My Deal
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PipelineStepIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
      <Loader2 className="h-4 w-4 animate-spin text-[#53A318]" />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
