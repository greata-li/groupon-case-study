import { Check } from 'lucide-react';

interface BusinessTypeStepProps {
  data: Record<string, unknown>;
  onUpdate: (field: string, value: unknown) => void;
}

const businessTypes = [
  {
    id: 'sole_provider',
    title: 'Sole provider',
    description:
      "I'm the sole provider of services, working independently of another business.",
    icon: 'user',
  },
  {
    id: 'independent_contractor',
    title: 'Independent contractor',
    description:
      "I'm an independent contractor, contracting to perform services for another company.",
    icon: 'briefcase',
  },
  {
    id: 'company',
    title: 'Company with 1+ employees',
    description:
      "I'm the owner of the company with more than one employee performing services.",
    icon: 'building',
  },
  {
    id: 'third_party',
    title: 'Third party representative',
    description:
      "I represent a marketing company and am setting up a campaign for a business providing the services.",
    icon: 'users',
  },
];

export function BusinessTypeStep({ data, onUpdate }: BusinessTypeStepProps) {
  const currentType = (data.business_type as string) || '';

  function selectType(id: string) {
    onUpdate('business_type', id);
  }

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-gray-900">
        What type of business are you?
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
        Choose the description that best matches your business. This helps us
        tailor the onboarding experience and deal requirements.
      </p>

      <div className="mt-8 max-w-xl space-y-3">
        {businessTypes.map((type) => {
          const isSelected = currentType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => selectType(type.id)}
              className={`group relative flex w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                isSelected
                  ? 'border-groupon-green bg-groupon-green-light/30 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Radio indicator */}
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isSelected
                    ? 'border-groupon-green bg-groupon-green'
                    : 'border-gray-300 bg-white group-hover:border-gray-400'
                }`}
              >
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>

              <div className="flex-1">
                <h3
                  className={`font-heading text-sm font-bold ${
                    isSelected ? 'text-groupon-green-dark' : 'text-gray-900'
                  }`}
                >
                  {type.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
