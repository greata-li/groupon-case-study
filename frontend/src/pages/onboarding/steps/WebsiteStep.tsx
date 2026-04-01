import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Globe, CheckCircle2, AlertCircle } from 'lucide-react';

interface WebsiteStepProps {
  data: Record<string, unknown>;
  onUpdate: (field: string, value: unknown) => void;
}

function validateUrl(url: string): { valid: boolean; message: string } {
  if (!url.trim()) {
    return { valid: false, message: 'Website URL is required.' };
  }
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('www.')
  ) {
    // Basic structure check
    if (trimmed.length < 10) {
      return { valid: false, message: 'Please enter a complete URL.' };
    }
    return { valid: true, message: '' };
  }
  return {
    valid: false,
    message: 'URL must start with http://, https://, or www.',
  };
}

const requirements = [
  {
    icon: CheckCircle2,
    text: 'Spelling of business name must match your Groupon listing',
  },
  {
    icon: CheckCircle2,
    text: 'Business name must be listed on the first page of your website',
  },
  {
    icon: CheckCircle2,
    text: 'Links to social media pages must be your business\'s accounts',
  },
];

export function WebsiteStep({ data, onUpdate }: WebsiteStepProps) {
  const [touched, setTouched] = useState(false);
  const website = (data.website as string) || '';
  const validation = validateUrl(website);
  const showError = touched && !validation.valid;

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-gray-900">
        What's your business website?
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
        Your website helps us verify your business and gives customers a place to
        learn more about you.
      </p>

      <div className="mt-8 max-w-md">
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="website" className="text-sm font-medium text-gray-700">
            Website URL
          </Label>
          <Badge className="bg-red-50 text-red-600 border-0 text-[10px] font-bold uppercase tracking-wider">
            Required
          </Badge>
        </div>

        <div className="relative">
          <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="website"
            type="url"
            value={website}
            onChange={(e) => onUpdate('website', (e.target as HTMLInputElement).value)}
            onBlur={() => setTouched(true)}
            placeholder="https://www.yourbusiness.com"
            className={`h-11 pl-10 rounded-lg ${
              showError
                ? 'border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200'
                : touched && validation.valid
                ? 'border-groupon-green focus-visible:border-groupon-green focus-visible:ring-groupon-green/20'
                : ''
            }`}
          />
          {touched && validation.valid && (
            <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-groupon-green" />
          )}
        </div>

        {showError && (
          <div className="mt-2 flex items-center gap-1.5 text-sm text-red-500">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {validation.message}
          </div>
        )}
      </div>

      {/* Requirements */}
      <div className="mt-10">
        <h3 className="font-heading text-sm font-bold text-gray-900 mb-3">
          Website requirements
        </h3>
        <div className="space-y-3">
          {requirements.map((req) => {
            const Icon = req.icon;
            return (
              <div key={req.text} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-groupon-green" />
                <span className="text-sm text-gray-600">{req.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
