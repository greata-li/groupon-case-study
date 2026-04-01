import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Globe,
  MapPin,
  Building2,
  FileText,
  CreditCard,
  Link2,
  Layers,
  Rocket,
} from 'lucide-react';

interface ReviewStepProps {
  data: Record<string, unknown>;
  onUpdate: (field: string, value: unknown) => void;
  onGoToStep: (step: number) => void;
  onComplete: () => void;
}

interface SectionConfig {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  stepIndex: number;
  fields: { label: string; key: string; required?: boolean }[];
}

const BUSINESS_TYPES: Record<string, string> = {
  sole_provider: 'Sole provider',
  independent_contractor: 'Independent contractor',
  company: 'Company with 1+ employees',
  third_party: 'Third party representative',
};

const sections: SectionConfig[] = [
  {
    title: 'Booking Platform',
    icon: Link2,
    stepIndex: 1,
    fields: [{ label: 'Platform', key: 'booking_platform' }],
  },
  {
    title: 'Campaign Category',
    icon: Layers,
    stepIndex: 2,
    fields: [{ label: 'Category', key: 'category', required: true }],
  },
  {
    title: 'Business Description',
    icon: FileText,
    stepIndex: 3,
    fields: [{ label: 'Description', key: 'business_description', required: true }],
  },
  {
    title: 'Business Website',
    icon: Globe,
    stepIndex: 4,
    fields: [{ label: 'Website', key: 'website', required: true }],
  },
  {
    title: 'Business Type',
    icon: Building2,
    stepIndex: 5,
    fields: [{ label: 'Type', key: 'business_type', required: true }],
  },
  {
    title: 'Address & Contact',
    icon: MapPin,
    stepIndex: 6,
    fields: [
      { label: 'Street', key: 'street' },
      { label: 'City', key: 'city' },
      { label: 'State', key: 'state' },
      { label: 'Postal code', key: 'postal_code' },
      { label: 'Country', key: 'country' },
      { label: 'Phone', key: 'phone' },
    ],
  },
  {
    title: 'Payment Information',
    icon: CreditCard,
    stepIndex: 7,
    fields: [
      { label: 'Bank name', key: 'bank_name' },
      { label: 'Institution number', key: 'institution_number' },
      { label: 'Transit number', key: 'transit_number' },
      { label: 'Account number', key: 'bank_account_number' },
    ],
  },
];

function getDisplayValue(key: string, value: unknown): string {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return '';
  }
  if (key === 'business_type') {
    return BUSINESS_TYPES[value as string] || (value as string);
  }
  if (key === 'booking_platform') {
    return value === 'none' ? 'No booking platform' : 'Connected';
  }
  if (key === 'bank_account_number') {
    const str = value as string;
    if (str.length > 4) {
      return '*'.repeat(str.length - 4) + str.slice(-4);
    }
    return str;
  }
  if (key === 'business_description') {
    const str = value as string;
    if (str.length > 120) return str.slice(0, 120) + '...';
    return str;
  }
  return value as string;
}

export function ReviewStep({ data, onGoToStep, onComplete }: ReviewStepProps) {
  // Count missing required fields
  const requiredFields = sections
    .flatMap((s) => s.fields.filter((f) => f.required))
    .map((f) => f.key);
  const missingFields = requiredFields.filter((key) => {
    const val = data[key];
    return !val || (typeof val === 'string' && !val.trim());
  });
  const hasMissing = missingFields.length > 0;

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-gray-900">
        Review your business profile
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
        Review the information below before completing your setup. You can edit
        any section by clicking the edit button.
      </p>

      {/* Missing fields warning */}
      {hasMissing && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              {missingFields.length} required field{missingFields.length > 1 ? 's' : ''} still missing
            </p>
            <p className="mt-0.5 text-xs text-amber-600">
              Please complete all required fields before finishing setup.
            </p>
          </div>
        </div>
      )}

      {/* Section cards */}
      <div className="mt-6 max-w-2xl space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const allEmpty = section.fields.every((f) => {
            const val = data[f.key];
            return !val || (typeof val === 'string' && !val.trim());
          });
          const hasRequiredMissing = section.fields.some(
            (f) =>
              f.required &&
              (!data[f.key] || (typeof data[f.key] === 'string' && !(data[f.key] as string).trim()))
          );

          return (
            <Card
              key={section.title}
              className={`border transition-colors ${
                hasRequiredMissing
                  ? 'border-amber-200'
                  : 'border-gray-200'
              }`}
            >
              <CardContent className="pt-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        allEmpty
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-groupon-green/10 text-groupon-green'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading text-sm font-bold text-gray-900">
                          {section.title}
                        </h3>
                        {hasRequiredMissing && (
                          <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-bold">
                            Incomplete
                          </Badge>
                        )}
                        {!allEmpty && !hasRequiredMissing && (
                          <CheckCircle2 className="h-4 w-4 text-groupon-green" />
                        )}
                      </div>
                      {allEmpty ? (
                        <p className="mt-1 text-xs text-gray-400 italic">
                          No information provided yet.
                        </p>
                      ) : (
                        <div className="mt-2 space-y-1">
                          {section.fields.map((field) => {
                            const display = getDisplayValue(field.key, data[field.key]);
                            if (!display) return null;
                            return (
                              <div key={field.key} className="flex gap-2 text-xs">
                                <span className="shrink-0 text-gray-400 w-28">
                                  {field.label}:
                                </span>
                                <span className="text-gray-700 break-words">
                                  {display}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => onGoToStep(section.stepIndex)}
                    variant="ghost"
                    size="sm"
                    className="shrink-0 rounded-lg text-xs font-medium text-gray-500 hover:text-groupon-green"
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator className="my-8 max-w-2xl" />

      {/* Complete CTA */}
      <div className="max-w-2xl">
        <Button
          onClick={onComplete}
          disabled={hasMissing}
          className={`group h-12 rounded-xl px-8 text-base font-bold text-white shadow-lg transition-all ${
            hasMissing
              ? 'bg-gray-300 shadow-none cursor-not-allowed'
              : 'bg-groupon-green shadow-groupon-green/20 hover:bg-groupon-green-dark hover:shadow-xl hover:shadow-groupon-green/30'
          }`}
        >
          <Rocket className="mr-2 h-4 w-4" />
          Complete Setup
        </Button>
        {hasMissing && (
          <p className="mt-2 text-xs text-gray-400">
            Complete all required fields to finish setup.
          </p>
        )}
      </div>
    </div>
  );
}
