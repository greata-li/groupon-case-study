import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ChevronDown, ChevronUp, FileText, Smartphone, Globe } from 'lucide-react';

interface PaymentStepProps {
  data: Record<string, unknown>;
  onUpdate: (field: string, value: unknown) => void;
}

const helpItems = [
  {
    icon: FileText,
    title: 'On a paper check',
    description: 'Your institution and transit numbers are printed at the bottom of your checks.',
  },
  {
    icon: CreditCard,
    title: 'Bank statement',
    description: 'Your account number appears on monthly statements. Institution and transit numbers may be listed as well.',
  },
  {
    icon: Smartphone,
    title: 'Bank website or mobile app',
    description: 'Log in to your online banking to find your full account details under account settings.',
  },
];

export function PaymentStep({ data, onUpdate }: PaymentStepProps) {
  const [helpOpen, setHelpOpen] = useState(false);

  const bankName = (data.bank_name as string) || '';
  const institutionNumber = (data.institution_number as string) || '';
  const transitNumber = (data.transit_number as string) || '';
  const accountNumber = (data.bank_account_number as string) || '';

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-gray-900">
        Add your payment information
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
        Where you want to receive payments owed to you. Groupon processes payouts
        directly to your bank account on a weekly schedule.
      </p>

      <Badge className="mt-3 bg-amber-50 text-amber-700 border-0 text-xs font-semibold">
        Prototype - payment processing simulated
      </Badge>

      <div className="mt-8 max-w-md space-y-5">
        {/* Bank Name */}
        <div>
          <Label htmlFor="bank-name" className="text-xs text-gray-600 mb-1">
            Bank Name
          </Label>
          <Input
            id="bank-name"
            value={bankName}
            onChange={(e) => onUpdate('bank_name', (e.target as HTMLInputElement).value)}
            placeholder="e.g., Chase, Bank of America, TD Bank"
            className="h-10 rounded-lg"
          />
        </div>

        {/* Institution Number */}
        <div>
          <Label htmlFor="institution-number" className="text-xs text-gray-600 mb-1">
            Institution Number
          </Label>
          <Input
            id="institution-number"
            value={institutionNumber}
            onChange={(e) =>
              onUpdate('institution_number', (e.target as HTMLInputElement).value)
            }
            placeholder="3-digit institution number"
            className="h-10 rounded-lg"
            maxLength={4}
          />
        </div>

        {/* Transit Number */}
        <div>
          <Label htmlFor="transit-number" className="text-xs text-gray-600 mb-1">
            Transit Number
          </Label>
          <Input
            id="transit-number"
            value={transitNumber}
            onChange={(e) =>
              onUpdate('transit_number', (e.target as HTMLInputElement).value)
            }
            placeholder="5-digit transit/routing number"
            className="h-10 rounded-lg"
            maxLength={9}
          />
        </div>

        {/* Account Number */}
        <div>
          <Label htmlFor="account-number" className="text-xs text-gray-600 mb-1">
            Bank Account Number
          </Label>
          <Input
            id="account-number"
            type="password"
            value={accountNumber}
            onChange={(e) =>
              onUpdate('bank_account_number', (e.target as HTMLInputElement).value)
            }
            placeholder="Your bank account number"
            className="h-10 rounded-lg"
          />
          <p className="mt-1 text-xs text-gray-400">
            Your account number is encrypted and stored securely.
          </p>
        </div>
      </div>

      {/* Where can I find this? */}
      <div className="mt-8 max-w-md">
        <button
          onClick={() => setHelpOpen(!helpOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100"
        >
          <span className="text-sm font-medium text-gray-700">
            Where can I find this?
          </span>
          {helpOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {helpOpen && (
          <div className="mt-2 rounded-lg border border-gray-200 bg-white p-4 animate-fade-in-up">
            <div className="space-y-4">
              {helpItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <Icon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
