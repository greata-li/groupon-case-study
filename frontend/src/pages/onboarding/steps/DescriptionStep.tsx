import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { VoiceInput } from '@/components/ui/voice-input';
import { Sparkles, PlusCircle, Loader2 } from 'lucide-react';

interface DescriptionStepProps {
  data: Record<string, unknown>;
  onUpdate: (field: string, value: unknown) => void;
}

const MAX_CHARS = 400;

const EXAMPLE_TEXT =
  'Example: "Serenity Spa offers a full range of massage therapy and skincare treatments in downtown Chicago. With over 10 years of experience, our certified therapists provide Swedish, deep tissue, and hot stone massages in a relaxing, modern setting. Visit us for a rejuvenating experience that leaves you feeling refreshed and renewed."';

function generateInspireText(data: Record<string, unknown>): string {
  const name = (data.business_name as string) || 'Your Business';
  const location = (data.location as string) || (data.city as string) || 'your area';
  const category = (data.category as string) || 'professional services';

  return `With years of dedicated experience, ${name} offers premium ${category.toLowerCase()} in ${location}. Our skilled team is committed to delivering exceptional results with every visit. We use high-quality products and proven techniques to ensure your complete satisfaction. Visit us today and discover why our clients keep coming back.`;
}

function expandText(existing: string, data: Record<string, unknown>): string {
  const category = (data.category as string) || '';
  const additions = [
    ' We pride ourselves on creating a welcoming, comfortable atmosphere for all our guests.',
    ` Whether you're a first-time visitor or a loyal regular, you'll experience the same exceptional level of care.`,
    ` Our ${category ? category.toLowerCase() + ' services are' : 'services are'} designed to exceed your expectations every time.`,
    ' Book your appointment today and see the difference that true expertise makes.',
  ];
  // Pick an addition that fits within the limit
  for (const add of additions) {
    if ((existing + add).length <= MAX_CHARS) {
      return existing + add;
    }
  }
  return existing;
}

export function DescriptionStep({ data, onUpdate }: DescriptionStepProps) {
  const [inspiring, setInspiring] = useState(false);
  const [expanding, setExpanding] = useState(false);

  const description = (data.business_description as string) || '';
  const remaining = MAX_CHARS - description.length;

  function handleChange(val: string) {
    if (val.length <= MAX_CHARS) {
      onUpdate('business_description', val);
    }
  }

  async function handleInspire() {
    setInspiring(true);
    // Small delay to simulate AI generation
    await new Promise((r) => setTimeout(r, 600));
    const text = generateInspireText(data);
    onUpdate('business_description', text.slice(0, MAX_CHARS));
    setInspiring(false);
  }

  async function handleShareMore() {
    if (!description.trim()) return;
    setExpanding(true);
    await new Promise((r) => setTimeout(r, 400));
    const expanded = expandText(description, data);
    onUpdate('business_description', expanded.slice(0, MAX_CHARS));
    setExpanding(false);
  }

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-gray-900">
        Describe your business
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
        Write a compelling description that tells customers what makes your business
        special. This will appear on your Groupon deal page.
      </p>

      {/* Textarea */}
      <div className="mt-6">
        <Textarea
          value={description}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Tell customers about your business, services, experience, and what makes you unique..."
          className="min-h-[160px] rounded-lg text-sm leading-relaxed"
        />

        {/* Character counter + action buttons */}
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleInspire}
              disabled={inspiring}
              size="sm"
              className="rounded-lg bg-groupon-green font-semibold text-white hover:bg-groupon-green-dark"
            >
              {inspiring ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              )}
              Inspire Me
            </Button>
            <Button
              onClick={handleShareMore}
              disabled={expanding || !description.trim()}
              variant="outline"
              size="sm"
              className="rounded-lg font-semibold"
            >
              {expanding ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
              )}
              Share More Details
            </Button>
            <VoiceInput
              onTranscript={(t) => {
                const updated = (description + ' ' + t).trim().slice(0, 400);
                onUpdate('business_description', updated);
              }}
            />
          </div>
          <span
            className={`text-xs font-medium tabular-nums ${
              remaining <= 50
                ? remaining <= 0
                  ? 'text-red-500'
                  : 'text-amber-500'
                : 'text-gray-400'
            }`}
          >
            {remaining} characters remaining
          </span>
        </div>
      </div>

      {/* Example */}
      <div className="mt-8 rounded-lg bg-gray-50 border border-gray-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
          Example
        </p>
        <p className="text-sm italic leading-relaxed text-gray-500">
          {EXAMPLE_TEXT}
        </p>
      </div>
    </div>
  );
}
