import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  generateDeal,
  suggestServices,
  type MerchantIntake,
  type PipelineResult,
  type ServiceSuggestion,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { validateStep, validatePhone, validateServicePrice } from '@/lib/validation';
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  Store,
  Briefcase,
  MapPin,
  DollarSign,
  MessageCircle,
  Phone,
  Plus,
  X,
  Trash2,
} from 'lucide-react';

// --- Types for the structured service picker ---

interface ServiceEntry {
  name: string;
  price: string; // string so the user can type freely
}

// --- Step definitions ---

const stepMeta = [
  {
    field: 'business_name' as const,
    label: "What's your business name?",
    placeholder: "e.g., Sofia's Studio",
    hint: 'The name customers will see on your deal.',
    type: 'input' as const,
    icon: Store,
  },
  {
    field: 'business_description' as const,
    label: 'What do you do?',
    placeholder:
      'e.g., Waxing and lash services, two-chair studio, 12 years experience',
    hint: 'Tell us about your business in a sentence or two. What services do you offer?',
    type: 'textarea' as const,
    icon: Briefcase,
  },
  {
    field: 'location' as const,
    label: 'Where are you located?',
    placeholder: 'e.g., Lincoln Park, Chicago',
    hint: 'City or neighborhood — helps us find the right customers near you.',
    type: 'input' as const,
    icon: MapPin,
  },
  {
    field: 'services' as const,
    label: 'What services do you want to offer?',
    placeholder: '',
    hint: "Add your services and regular prices. We'll recommend the best deal pricing.",
    type: 'service_picker' as const,
    icon: DollarSign,
  },
  {
    field: 'additional_info' as const,
    label: 'Anything else customers should know?',
    placeholder:
      'e.g., Loyal regulars, slow Tuesdays and Wednesdays, parking available',
    hint: 'Optional — hours, specialties, what days you want to fill.',
    type: 'textarea' as const,
    icon: MessageCircle,
  },
  {
    field: 'contact_details' as const,
    label: 'How can customers reach you?',
    placeholder: '',
    hint: 'Your contact details will appear on your deal listing and vouchers.',
    type: 'contact' as const,
    icon: Phone,
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
  const [animKey, setAnimKey] = useState(0);

  // Core form data
  const [form, setForm] = useState<MerchantIntake>({
    business_name: '',
    business_description: '',
    location: '',
    services: '',
    additional_info: '',
    phone: '',
    address: '',
    website: '',
  });

  // Structured services (used by the service picker in step 4)
  const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([
    { name: '', price: '' },
  ]);

  // AI suggestions
  const [suggestions, setSuggestions] = useState<ServiceSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsRequested, setSuggestionsRequested] = useState(false);

  const step = stepMeta[currentStep];
  const isLastStep = currentStep === stepMeta.length - 1;

  // Determine if user can advance
  const canAdvance = (() => {
    if (step.field === 'additional_info') return true;
    if (step.field === 'contact_details') return true; // contact is optional to advance
    if (step.field === 'services') {
      return serviceEntries.some((s) => s.name.trim() && s.price.trim());
    }
    if (step.field === 'contact_details') return true;
    return (form[step.field as keyof MerchantIntake] || '').toString().trim().length > 0;
  })();

  // Fire service suggestions after Step 2 (business description) is completed
  const fetchSuggestions = useCallback(async () => {
    if (suggestionsRequested) return;
    if (!form.business_description.trim()) return;

    setSuggestionsRequested(true);
    setLoadingSuggestions(true);
    try {
      const result = await suggestServices(
        form.business_description,
        form.location || 'United States',
      );
      let output = result.output;

      // If the LLM wrapped response in code fences, parse on the client side
      if (output?.parse_error && output?.raw_response) {
        try {
          const raw = (output.raw_response as string)
            .replace(/^```(?:json)?\s*\n?/, '')
            .replace(/\n?```\s*$/, '')
            .trim();
          output = JSON.parse(raw);
        } catch {
          // couldn't parse — fall through
        }
      }

      if (output?.suggestions) {
        setSuggestions(output.suggestions as ServiceSuggestion[]);
      }
    } catch {
      // Silently fail — suggestions are a nicety, not required
    } finally {
      setLoadingSuggestions(false);
    }
  }, [form.business_description, form.location, suggestionsRequested]);

  // Trigger suggestions when arriving at step 3 (location) or step 4 (services)
  useEffect(() => {
    if (currentStep >= 2 && form.business_description.trim() && !suggestionsRequested) {
      fetchSuggestions();
    }
  }, [currentStep, fetchSuggestions, form.business_description, suggestionsRequested]);

  function handleNext() {
    // Validate current step before advancing
    const validationError = getStepValidationError();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    if (isLastStep) {
      handleGenerate();
    } else {
      if (step.field === 'services') {
        syncServicesToText();
      }
      setCurrentStep((s) => s + 1);
      setAnimKey((k) => k + 1);
    }
  }

  function getStepValidationError(): string | null {
    if (step.type === 'input' || step.type === 'textarea') {
      const val = (form[step.field as keyof MerchantIntake] || '') as string;
      return validateStep(step.field, val);
    }
    if (step.type === 'service_picker') {
      const filled = serviceEntries.filter((s) => s.name.trim());
      if (filled.length === 0) return 'Please add at least one service';
      for (const s of filled) {
        const priceErr = validateServicePrice(s.price);
        if (priceErr) return `${s.name}: ${priceErr}`;
      }
      return null;
    }
    if (step.type === 'contact') {
      const phoneErr = validatePhone(form.phone || '');
      if (phoneErr) return phoneErr;
      return null;
    }
    return null;
  }

  function handleBack() {
    if (currentStep === 0) {
      navigate('/');
    } else {
      setCurrentStep((s) => s - 1);
      setAnimKey((k) => k + 1);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey && step.type === 'input') {
      e.preventDefault();
      if (canAdvance) handleNext();
    }
  }

  function syncServicesToText() {
    const text = serviceEntries
      .filter((s) => s.name.trim())
      .map((s) => `${s.name}${s.price ? ` $${s.price.replace('$', '')}` : ''}`)
      .join(', ');
    setForm((f) => ({ ...f, services: text }));
  }

  async function handleGenerate() {
    // Ensure services text is synced
    syncServicesToText();
    setGenerating(true);
    setError(null);
    try {
      // Read the latest services text
      const servicesText = serviceEntries
        .filter((s) => s.name.trim())
        .map((s) => `${s.name}${s.price ? ` $${s.price.replace('$', '')}` : ''}`)
        .join(', ');
      const result = await generateDeal({ ...form, services: servicesText });
      onResult(result, { ...form, services: servicesText });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Something went wrong. Please try again.',
      );
      setGenerating(false);
    }
  }

  // --- Service picker helpers ---

  function addServiceEntry() {
    setServiceEntries((prev) => [...prev, { name: '', price: '' }]);
  }

  function removeServiceEntry(index: number) {
    setServiceEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function updateServiceEntry(
    index: number,
    field: 'name' | 'price',
    value: string,
  ) {
    setServiceEntries((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  }

  function addSuggestion(suggestion: ServiceSuggestion) {
    // Don't add duplicates
    if (serviceEntries.some((s) => s.name === suggestion.name)) return;

    const midPrice = Math.round(
      (suggestion.typical_price_min + suggestion.typical_price_max) / 2,
    );

    // If there's an empty first row, fill it. Otherwise append.
    setServiceEntries((prev) => {
      const firstEmpty = prev.findIndex((s) => !s.name.trim() && !s.price.trim());
      if (firstEmpty >= 0) {
        return prev.map((s, i) =>
          i === firstEmpty ? { name: suggestion.name, price: String(midPrice) } : s,
        );
      }
      return [...prev, { name: suggestion.name, price: String(midPrice) }];
    });
  }

  // --- Generating state ---
  if (generating) {
    return <GeneratingState />;
  }

  const StepIcon = step.icon;

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        {/* Progress dots */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {stepMeta.map((_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                    i < currentStep
                      ? 'bg-groupon-green text-white'
                      : i === currentStep
                        ? 'bg-groupon-green text-white ring-4 ring-groupon-green/20'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i < currentStep ? '\u2713' : i + 1}
                </div>
                {i < stepMeta.length - 1 && (
                  <div
                    className={`mx-1 h-0.5 w-8 transition-colors duration-300 md:w-16 ${
                      i < currentStep ? 'bg-groupon-green' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Question card */}
        <div key={animKey} className="animate-fade-in-up">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-900/[0.04] md:p-10">
            {/* Icon + label */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-groupon-green/10 text-groupon-green">
                <StepIcon className="h-5 w-5" />
              </div>
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-gray-300">
                Step {currentStep + 1} of {stepMeta.length}
              </span>
            </div>

            <h2 className="font-heading text-2xl font-bold tracking-tight text-gray-900">
              {step.label}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {step.hint}
            </p>

            {/* Input area */}
            <div className="mt-6">
              {step.type === 'input' && (
                <Input
                  autoFocus
                  value={(form[step.field as keyof MerchantIntake] || '') as string}
                  onChange={(e) =>
                    setForm({ ...form, [step.field]: e.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={step.placeholder}
                  className="h-13 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-base transition-colors focus:border-groupon-green focus:bg-white focus:ring-groupon-green/20"
                />
              )}

              {step.type === 'textarea' && (
                <Textarea
                  autoFocus
                  value={(form[step.field as keyof MerchantIntake] || '') as string}
                  onChange={(e) =>
                    setForm({ ...form, [step.field]: e.target.value })
                  }
                  placeholder={step.placeholder}
                  className="min-h-[130px] rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-base transition-colors focus:border-groupon-green focus:bg-white focus:ring-groupon-green/20"
                />
              )}

              {step.type === 'service_picker' && (
                <ServicePicker
                  entries={serviceEntries}
                  suggestions={suggestions}
                  loadingSuggestions={loadingSuggestions}
                  onUpdate={updateServiceEntry}
                  onRemove={removeServiceEntry}
                  onAdd={addServiceEntry}
                  onAddSuggestion={addSuggestion}
                />
              )}

              {step.type === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Phone Number
                    </label>
                    <Input
                      autoFocus
                      value={form.phone || ''}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g., (312) 555-0123"
                      className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-base transition-colors focus:border-groupon-green focus:bg-white focus:ring-groupon-green/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Full Business Address
                    </label>
                    <Input
                      value={form.address || ''}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="e.g., 1234 N Milwaukee Ave, Chicago, IL 60622"
                      className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-base transition-colors focus:border-groupon-green focus:bg-white focus:ring-groupon-green/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Business Website <span className="text-xs text-gray-400 font-normal">(optional)</span>
                    </label>
                    <Input
                      value={form.website || ''}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="e.g., www.sofiasstudio.com"
                      className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-base transition-colors focus:border-groupon-green focus:bg-white focus:ring-groupon-green/20"
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canAdvance}
                className="h-11 rounded-xl bg-groupon-green px-8 font-bold text-white shadow-md shadow-groupon-green/20 transition-all hover:bg-groupon-green-dark hover:shadow-lg disabled:opacity-40 disabled:shadow-none"
              >
                {isLastStep ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate My Deal
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Reassurance */}
        <p className="mt-6 text-center text-xs text-gray-400">
          {isLastStep
            ? 'This will take about 10 seconds. You\u2019ll review everything before publishing.'
            : 'Your information is only used to generate your deal.'}
        </p>
      </div>
    </div>
  );
}

// ─── Service Picker Component ───

interface ServicePickerProps {
  entries: ServiceEntry[];
  suggestions: ServiceSuggestion[];
  loadingSuggestions: boolean;
  onUpdate: (index: number, field: 'name' | 'price', value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
  onAddSuggestion: (suggestion: ServiceSuggestion) => void;
}

function ServicePicker({
  entries,
  suggestions,
  loadingSuggestions,
  onUpdate,
  onRemove,
  onAdd,
  onAddSuggestion,
}: ServicePickerProps) {
  // Filter out suggestions already added
  const addedNames = new Set(entries.map((e) => e.name));
  const availableSuggestions = suggestions.filter(
    (s) => !addedNames.has(s.name),
  );

  return (
    <div className="space-y-4">
      {/* AI suggestions */}
      {(loadingSuggestions || availableSuggestions.length > 0) && (
        <div className="rounded-xl border border-groupon-green/15 bg-groupon-green-light/20 p-4">
          <div className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-groupon-green">
            <Sparkles className="h-3.5 w-3.5" />
            {loadingSuggestions
              ? 'Finding services for your business...'
              : 'Suggested services — tap to add'}
          </div>

          {loadingSuggestions ? (
            <div className="flex items-center gap-2 py-1 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-groupon-green" />
              Analyzing your business...
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.map((s) => (
                <button
                  key={s.name}
                  onClick={() => onAddSuggestion(s)}
                  className="group flex items-center gap-1.5 rounded-lg border border-groupon-green/20 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-groupon-green hover:bg-groupon-green hover:text-white"
                >
                  <Plus className="h-3 w-3 text-groupon-green group-hover:text-white" />
                  {s.name}
                  <span className="text-xs text-gray-400 group-hover:text-white/70">
                    ~${Math.round((s.typical_price_min + s.typical_price_max) / 2)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Service rows */}
      <div className="space-y-2.5">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={entry.name}
              onChange={(e) => onUpdate(i, 'name', e.target.value)}
              placeholder="Service name"
              className="flex-1 rounded-lg border-gray-200 bg-gray-50/50 text-sm transition-colors focus:border-groupon-green focus:bg-white"
            />
            <div className="relative w-28">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                $
              </span>
              <Input
                value={entry.price}
                onChange={(e) => onUpdate(i, 'price', e.target.value)}
                placeholder="0"
                className="rounded-lg border-gray-200 bg-gray-50/50 pl-7 text-sm transition-colors focus:border-groupon-green focus:bg-white"
              />
            </div>
            {entries.length > 1 && (
              <button
                onClick={() => onRemove(i)}
                className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add row */}
      <button
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:border-groupon-green hover:text-groupon-green"
      >
        <Plus className="h-4 w-4" />
        Add another service
      </button>
    </div>
  );
}

// ─── Generating State ───

function GeneratingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 2000),
      setTimeout(() => setActiveStep(2), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const pipelineSteps = [
    {
      label: 'Classifying your business',
      detail: 'Matching to the right Groupon category',
    },
    {
      label: 'Analyzing your market',
      detail: 'Checking what works for your area and services',
    },
    {
      label: 'Crafting your deal',
      detail: 'Writing copy, setting prices, building your listing',
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-6">
      <div className="w-full max-w-md text-center animate-fade-in-up">
        <div className="relative mx-auto mb-8 h-20 w-20">
          <div
            className="absolute inset-0 rounded-full bg-groupon-green/10 animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-groupon-green/10">
            <Sparkles className="h-8 w-8 animate-pulse text-groupon-green" />
          </div>
        </div>

        <h2 className="font-heading text-2xl font-bold text-gray-900">
          Creating your deal...
        </h2>
        <p className="mt-2 text-gray-500">
          Our AI is building a complete Groupon deal tailored to your business.
        </p>

        <div className="stagger-children mt-10 space-y-3 text-left">
          {pipelineSteps.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 rounded-xl border px-5 py-4 transition-all duration-500 ${
                i < activeStep
                  ? 'border-groupon-green/20 bg-groupon-green-light/50'
                  : i === activeStep
                    ? 'border-groupon-green/30 bg-white shadow-md shadow-groupon-green/10'
                    : 'border-gray-100 bg-gray-50/50'
              }`}
            >
              <div className="shrink-0">
                {i < activeStep ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-groupon-green text-xs font-bold text-white">
                    {'\u2713'}
                  </div>
                ) : i === activeStep ? (
                  <Loader2 className="h-5 w-5 animate-spin text-groupon-green" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-gray-200" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${i <= activeStep ? 'text-gray-900' : 'text-gray-400'}`}
                >
                  {step.label}
                </p>
                {i === activeStep && (
                  <p className="mt-0.5 text-xs text-gray-500">{step.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
