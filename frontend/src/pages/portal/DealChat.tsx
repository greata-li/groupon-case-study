import { useState, useRef, useEffect } from 'react';
import { extractDeal, type ExtractedDeal } from '@/lib/api';
import { VoiceInput } from '@/components/ui/voice-input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Loader2,
  Sparkles,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}

interface ProfileService {
  name: string;
  price: number;
}

interface DealChatProps {
  businessName: string;
  services: ProfileService[];
  onDealExtracted: (deal: ExtractedDeal) => void;
  onSkip: () => void;
}

// Questions the AI needs answered before creating the deal
interface DealInfo {
  services: string | null;   // which services to include
  discount: string | null;   // what discount
  duration: string | null;   // how long (30/60/90 days)
  scheduling: string | null; // target days/times
  specialTerms: string | null; // any special restrictions
}

function buildGreeting(businessName: string, services: ProfileService[]): string {
  const name = businessName || 'there';
  if (services.length === 0) {
    return `Hi ${name}! Let's create a deal for your business. First, what services would you like to offer?`;
  }
  const serviceList = services
    .map((s) => `  • ${s.name} - $${s.price}`)
    .join('\n');
  return `Hi ${name}! I can see you offer:\n\n${serviceList}\n\nWhich of these would you like to include in your deal? You can say "all of them" or pick specific ones.`;
}

function getNextQuestion(info: DealInfo): string | null {
  if (!info.services) return null; // already asked in greeting
  if (!info.discount) {
    return "Great choices! What discount would you like to offer? For beauty and wellness, 30-40% off tends to perform best on Groupon. What are you thinking?";
  }
  if (!info.duration) {
    return "How long should this deal run? Options are usually 30 days, 60 days, or 90 days. 90 days is the most popular.";
  }
  if (!info.scheduling) {
    return "Are there specific days or times you want to target? For example, if Tuesdays are slow, we can recommend the deal for midweek bookings. Or say 'anytime' if you're flexible.";
  }
  if (!info.specialTerms) {
    return "Last thing - any special terms? For example: new customers only, appointment required, not valid with other offers. Or say 'standard terms' and I'll set sensible defaults.";
  }
  return null; // all questions answered
}

function parseUserResponse(text: string, info: DealInfo): Partial<DealInfo> {
  const lower = text.toLowerCase();
  const updates: Partial<DealInfo> = {};

  // Try to detect ALL fields in one message

  // Services - if we haven't captured services yet, the whole message is about services
  // But also check if they mentioned discount/duration/etc. in the same message
  if (!info.services) {
    updates.services = text;
  }

  // Discount - look for percentage mentions (e.g. "30% off", "30% discount", "30 percent", bare "30%")
  const discountMatch = lower.match(/(\d+)\s*(%\s*(off|discount)?|percent)/);
  if (discountMatch && !info.discount) {
    updates.discount = text;
    // If services weren't set yet but they mentioned both, capture services too
    if (!info.services) {
      updates.services = text;
    }
  }

  // Duration - look for day/month mentions
  const durationMatch = lower.match(/(\d+)\s*(day|days|month|months)/);
  if (durationMatch && !info.duration) {
    updates.duration = text;
  }

  // Scheduling - look for day names or "anytime"
  const schedWords = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'weekday', 'weekend', 'midweek', 'anytime', 'flexible'];
  if (schedWords.some((w) => lower.includes(w)) && !info.scheduling) {
    updates.scheduling = text;
  }

  // Special terms - look for restriction keywords
  const termWords = ['new customer', 'appointment', 'standard', 'no refund', 'waiver', 'default'];
  if (termWords.some((w) => lower.includes(w)) && !info.specialTerms) {
    updates.specialTerms = text;
  }

  // If nothing was detected, fill the next empty field sequentially
  if (Object.keys(updates).length === 0) {
    if (!info.services) return { services: text };
    if (!info.discount) return { discount: text };
    if (!info.duration) return { duration: text };
    if (!info.scheduling) return { scheduling: text };
    if (!info.specialTerms) return { specialTerms: text };
  }

  return updates;
}

export function DealChat({ businessName, services, onDealExtracted, onSkip }: DealChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: buildGreeting(businessName, services) },
  ]);
  const [input, setInput] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dealInfo, setDealInfo] = useState<DealInfo>({
    services: null,
    discount: null,
    duration: null,
    scheduling: null,
    specialTerms: null,
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    setError(null);

    setMessages((prev) => [...prev, { role: 'user', text: userText }]);

    // Update deal info with the user's response - detects multiple fields in one message
    const updatedFields = parseUserResponse(userText, dealInfo);
    const newInfo = { ...dealInfo, ...updatedFields };
    setDealInfo(newInfo);

    // Check if there's a next question to ask
    const nextQ = getNextQuestion(newInfo);

    if (nextQ) {
      // Ask the next question
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'assistant', text: nextQ }]);
      }, 500);
    } else {
      // All info gathered - extract the deal
      await extractFullDeal(newInfo);
    }
  }

  async function extractFullDeal(info: DealInfo) {
    setExtracting(true);
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', text: '✨ Perfect! Let me set up your deal...' },
    ]);

    // Build a comprehensive story from all gathered info
    const story = [
      `Services: ${info.services}`,
      `Discount: ${info.discount}`,
      `Duration: ${info.duration}`,
      `Scheduling: ${info.scheduling}`,
      `Terms: ${info.specialTerms}`,
    ].join('. ');

    try {
      const result = await extractDeal(story);

      if (result.parse_error) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: 'assistant',
            text: "I had some trouble setting that up. Let me try again - could you describe the deal in one sentence?",
          },
        ]);
        // Reset to allow retry
        setDealInfo({ services: null, discount: null, duration: null, scheduling: null, specialTerms: null });
        setExtracting(false);
        return;
      }

      const serviceCount = result.selected_services?.length || 0;
      const maxDiscount = Math.max(...(result.selected_services?.map((s) => s.discount_pct) || [0]));

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          text: `All done! Here's what I've set up:\n\n` +
            `📋 ${serviceCount} service${serviceCount !== 1 ? 's' : ''} at up to ${maxDiscount}% off\n` +
            `📅 Running for ${result.expiry_days} days\n` +
            `✨ ${(result.highlights?.split('\n').filter(Boolean) || []).length} highlights generated\n` +
            `📝 Descriptions written for each service\n\n` +
            `I'll show you everything now so you can review and adjust before publishing.`,
        },
      ]);

      setTimeout(() => {
        onDealExtracted(result);
      }, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' },
      ]);
      setExtracting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Progress indicator
  const answeredCount = Object.values(dealInfo).filter(Boolean).length;
  const totalQuestions = 5;

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-60px)]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-groupon-green">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-gray-900">Create a Deal</h2>
              <p className="text-xs text-gray-500">
                Answer a few questions and our AI will set everything up
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {answeredCount > 0 && (
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded-full transition-colors ${
                      i < answeredCount ? 'bg-groupon-green' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Set up manually
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-[#fafaf8]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-groupon-green text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md shadow-sm'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="h-3 w-3 text-groupon-green" />
                    <span className="text-[11px] font-bold text-groupon-green">AI Deal Assistant</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}

          {extracting && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 rounded-bl-md shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin text-groupon-green" />
                  Setting up your deal...
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Example prompts on first view */}
      {messages.length === 1 && (
        <div className="bg-[#fafaf8] px-4 sm:px-6 pb-2">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-gray-400 mb-2">Quick start:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "All of them",
                "Just the 60-minute massages",
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  className="rounded-xl border border-gray-200 bg-white p-3 text-left text-xs text-gray-500 hover:border-groupon-green/30 hover:bg-groupon-green/[0.02] transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-end gap-2 sm:gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !dealInfo.services ? "Which services do you want to include?"
              : !dealInfo.discount ? "What discount percentage?"
              : !dealInfo.duration ? "How long should the deal run?"
              : !dealInfo.scheduling ? "Any specific days or times?"
              : !dealInfo.specialTerms ? "Any special terms or restrictions?"
              : "Describe your deal..."
            }
            className="rounded-xl border-gray-200 min-h-[48px] max-h-[120px] resize-none text-sm flex-1"
            rows={1}
            disabled={extracting}
          />
          <VoiceInput
            onTranscript={(t) => setInput((prev) => (prev ? prev + ' ' + t : t))}
            className="h-10 rounded-xl shrink-0"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || extracting}
            className="h-10 rounded-xl bg-groupon-green text-white hover:bg-groupon-green-dark shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {error && <p className="mt-2 text-xs text-red-500 max-w-2xl mx-auto">{error}</p>}
      </div>
    </div>
  );
}
