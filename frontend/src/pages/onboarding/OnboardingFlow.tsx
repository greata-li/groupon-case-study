import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Sparkles,
  Calendar,
  Layers,
  FileText,
  Globe,
  Building2,
  MapPin,
  CreditCard,
  ClipboardCheck,
} from 'lucide-react';

import { WelcomeStep } from './steps/WelcomeStep';
import { BookingStep } from './steps/BookingStep';
import { CategoryStep } from './steps/CategoryStep';
import { DescriptionStep } from './steps/DescriptionStep';
import { WebsiteStep } from './steps/WebsiteStep';
import { BusinessTypeStep } from './steps/BusinessTypeStep';
import { AddressStep } from './steps/AddressStep';
import { PaymentStep } from './steps/PaymentStep';
import { ReviewStep } from './steps/ReviewStep';

interface StepConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  { id: 'welcome', label: 'Welcome', icon: Sparkles },
  { id: 'booking', label: 'Booking Platform', icon: Calendar },
  { id: 'category', label: 'Category', icon: Layers },
  { id: 'description', label: 'Business Description', icon: FileText },
  { id: 'website', label: 'Business Website', icon: Globe },
  { id: 'business-type', label: 'Business Type', icon: Building2 },
  { id: 'address', label: 'Address & Contact', icon: MapPin },
  { id: 'payment', label: 'Payment Info', icon: CreditCard },
  { id: 'review', label: 'Review', icon: ClipboardCheck },
];

function isStepComplete(stepId: string, data: Record<string, unknown>): boolean {
  switch (stepId) {
    case 'welcome':
      return true; // Always "complete" once you pass it
    case 'booking':
      return Boolean(data.booking_platform);
    case 'category':
      return Boolean(data.category);
    case 'description':
      return Boolean(data.business_description && (data.business_description as string).trim().length > 0);
    case 'website':
      return Boolean(data.website && (data.website as string).trim().length > 0);
    case 'business-type':
      return Boolean(data.business_type);
    case 'address':
      return Boolean(data.city || data.street);
    case 'payment':
      return Boolean(data.bank_name);
    case 'review':
      return false;
    default:
      return false;
  }
}

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing profile on mount
  useEffect(() => {
    fetchProfile()
      .then((profile) => {
        if (profile && typeof profile === 'object') {
          setProfileData(profile);
          // Restore step if previously saved
          const savedStep = profile.onboarding_step;
          if (typeof savedStep === 'number' && savedStep >= 0 && savedStep < STEPS.length) {
            setCurrentStep(savedStep);
          }
        }
      })
      .catch(() => {
        // No profile yet, start fresh
      })
      .finally(() => setLoading(false));
  }, []);

  // Persist to API
  const persistProfile = useCallback(
    async (data: Record<string, unknown>, step: number) => {
      setSaving(true);
      try {
        await updateProfile({ ...data, onboarding_step: step });
      } catch {
        // Silent fail in prototype
      } finally {
        setSaving(false);
      }
    },
    []
  );

  function handleUpdate(field: string, value: unknown) {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  }

  function goToStep(step: number) {
    if (step >= 0 && step < STEPS.length) {
      setCurrentStep(step);
      persistProfile(profileData, step);
    }
  }

  function handleNext() {
    if (currentStep < STEPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      persistProfile(profileData, next);
    }
  }

  function handlePrevious() {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      persistProfile(profileData, prev);
    }
  }

  async function handleComplete() {
    setSaving(true);
    try {
      await updateProfile({
        ...profileData,
        onboarding_complete: true,
        onboarding_completed_at: new Date().toISOString(),
      });
    } catch {
      // Silent fail
    } finally {
      setSaving(false);
      navigate('/portal/home');
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Loading your profile...</span>
        </div>
      </div>
    );
  }

  const currentStepConfig = STEPS[currentStep];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left sidebar */}
      <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-gray-200 bg-white">
        {/* Logo area */}
        <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-groupon-green">
            <span className="text-sm font-extrabold text-white">G</span>
          </div>
          <span className="font-heading text-base font-bold text-gray-900">
            Merchant Setup
          </span>
        </div>

        {/* Step list */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || (index < currentStep && isStepComplete(step.id, profileData));
              const isPast = index < currentStep;
              const Icon = step.icon;

              return (
                <li key={step.id}>
                  <button
                    onClick={() => goToStep(index)}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                      isActive
                        ? 'bg-groupon-green-light/50 text-groupon-green-dark'
                        : isPast
                        ? 'text-gray-600 hover:bg-gray-50'
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                    }`}
                  >
                    {/* Step indicator */}
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        isPast && isStepComplete(step.id, profileData)
                          ? 'bg-groupon-green text-white'
                          : isActive
                          ? 'bg-groupon-green text-white'
                          : 'border-2 border-gray-300 text-gray-400 group-hover:border-gray-400'
                      }`}
                    >
                      {isPast && isStepComplete(step.id, profileData) ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? 'text-groupon-green-dark font-semibold'
                          : isPast
                          ? 'text-gray-700'
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Save indicator */}
        <div className="border-t border-gray-100 px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-groupon-green" />
                Progress saved
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile step indicator */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <span className="text-xs font-medium text-gray-500">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-xs font-semibold text-gray-900">
            {currentStepConfig.label}
          </span>
        </div>

        {/* Progress bar (mobile) */}
        <div className="h-1 bg-gray-100 md:hidden">
          <div
            className="h-full bg-groupon-green transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Scrollable step content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-8 md:px-10 md:py-12">
            {currentStep === 0 && (
              <WelcomeStep data={profileData} onUpdate={handleUpdate} onNext={handleNext} />
            )}
            {currentStep === 1 && (
              <BookingStep data={profileData} onUpdate={handleUpdate} />
            )}
            {currentStep === 2 && (
              <CategoryStep data={profileData} onUpdate={handleUpdate} />
            )}
            {currentStep === 3 && (
              <DescriptionStep data={profileData} onUpdate={handleUpdate} />
            )}
            {currentStep === 4 && (
              <WebsiteStep data={profileData} onUpdate={handleUpdate} />
            )}
            {currentStep === 5 && (
              <BusinessTypeStep data={profileData} onUpdate={handleUpdate} />
            )}
            {currentStep === 6 && (
              <AddressStep data={profileData} onUpdate={handleUpdate} />
            )}
            {currentStep === 7 && (
              <PaymentStep data={profileData} onUpdate={handleUpdate} />
            )}
            {currentStep === 8 && (
              <ReviewStep
                data={profileData}
                onUpdate={handleUpdate}
                onGoToStep={goToStep}
                onComplete={handleComplete}
              />
            )}
          </div>
        </main>

        {/* Bottom navigation bar */}
        <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className={`rounded-lg font-semibold transition-all ${
                currentStep === 0 ? 'invisible' : ''
              }`}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <div className="hidden items-center gap-1.5 sm:flex">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToStep(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentStep
                      ? 'w-6 bg-groupon-green'
                      : i < currentStep
                      ? 'w-2 bg-groupon-green/40'
                      : 'w-2 bg-gray-200'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            {/* Next / Complete button */}
            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                className="rounded-lg bg-groupon-green font-semibold text-white hover:bg-groupon-green-dark"
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              // On Review step, the CTA is inside the ReviewStep component
              <div className="w-[88px]" /> // Spacer for alignment
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
