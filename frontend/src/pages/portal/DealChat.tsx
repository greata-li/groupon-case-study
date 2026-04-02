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
  Mic,
} from 'lucide-react';

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}

interface DealChatProps {
  businessName: string;
  onDealExtracted: (deal: ExtractedDeal) => void;
  onSkip: () => void;
}

export function DealChat({ businessName, onDealExtracted, onSkip }: DealChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: `Hi ${businessName || 'there'}! What deal would you like to create? Tell me which services you want to offer, any pricing preferences, and how long you'd like it to run. I'll set everything up for you.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setMessages((prev) => [...prev, { role: 'assistant', text: '✨ Creating your deal...' }]);
    setExtracting(true);

    try {
      const result = await extractDeal(userText);

      if (result.parse_error) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: 'assistant',
            text: "I had trouble with that. Could you try again? For example: \"I want to offer my massage services at 35% off for 3 months.\"",
          },
        ]);
        setExtracting(false);
        return;
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          text: `Got it! I've set up your deal with ${result.selected_services?.length || 0} service${(result.selected_services?.length || 0) !== 1 ? 's' : ''}, pricing, highlights, and all the details. Let me show you everything so you can review and adjust.`,
        },
      ]);

      // Brief delay so the user sees the confirmation before transitioning
      setTimeout(() => {
        onDealExtracted(result);
      }, 1500);
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

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-60px)]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-groupon-green">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-gray-900">Create a Deal</h2>
              <p className="text-xs text-gray-500">
                Describe your deal and our AI will set everything up
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Set up manually instead
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-[#fafaf8]">
        <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
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

          {extracting && messages[messages.length - 1]?.text === '✨ Creating your deal...' && (
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
        <div className="bg-[#fafaf8] px-6 pb-2">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-gray-400 mb-2">Try something like:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                "I want to offer all my services at 35% off, running for 3 months",
                "Run a deal on my deep tissue massage, 40% off, Tuesdays and Wednesdays only",
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
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the deal you want to create..."
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
