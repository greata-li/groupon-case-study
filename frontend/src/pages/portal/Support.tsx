import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Briefcase,
  Megaphone,
  Ticket,
  CreditCard,
  Settings,
  TrendingUp,
  MessageSquare,
  Send,
  Phone,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES = [
  {
    icon: Briefcase,
    title: 'Prepare Your Business',
    description: 'Profile setup, photos, scheduling, and getting ready to launch.',
    articles: 12,
  },
  {
    icon: Megaphone,
    title: 'Launch Campaign',
    description: 'Creating deals, pricing strategy, category selection, and campaign tips.',
    articles: 18,
  },
  {
    icon: Ticket,
    title: 'Redemption',
    description: 'Voucher codes, redemption methods, and handling customer visits.',
    articles: 9,
  },
  {
    icon: CreditCard,
    title: 'Payments',
    description: 'Payout schedule, bank details, refunds, and financial reporting.',
    articles: 14,
  },
  {
    icon: Settings,
    title: 'Tools & Integrations',
    description: 'Booking platforms, API access, and third-party connections.',
    articles: 7,
  },
  {
    icon: TrendingUp,
    title: 'Promotions & Growth',
    description: 'Featured placements, seasonal deals, and repeat customer strategies.',
    articles: 11,
  },
];

export function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Hi! I\'m your Groupon Merchant AI assistant. I can help you with setting up your business, creating campaigns, understanding payments, and more. What can I help you with today?',
    },
  ]);

  function handleSendChat() {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage.trim();
    setChatHistory((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage('');

    // Simulated response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Thanks for your question about "${userMsg}". This is a demo of the AI chat assistant. In production, this would connect to our support AI to provide instant answers from our knowledge base.`,
        },
      ]);
    }, 800);
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl animate-fade-in-up">
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold text-gray-900">Support</h1>
        <p className="mt-1 text-sm text-gray-500">Find answers and get help with your merchant account.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
          placeholder="Search help articles..."
          className="h-12 pl-12 text-base rounded-xl border-gray-200"
        />
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {CATEGORIES.filter((cat) => {
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          return (
            cat.title.toLowerCase().includes(q) ||
            cat.description.toLowerCase().includes(q)
          );
        }).map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-groupon-green/10">
                    <Icon className="h-5 w-5 text-groupon-green" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{category.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{category.description}</p>
                    <p className="text-[11px] text-groupon-green font-medium mt-2">{category.articles} articles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="bg-groupon-green-light/30 border-groupon-green/20">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-groupon-green/20">
                <Phone className="h-6 w-6 text-groupon-green" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Contact Sales Representative</h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Speak with a Groupon specialist about your business needs.
                </p>
                <Button
                  size="sm"
                  className="mt-2 rounded-lg bg-groupon-green text-xs font-bold text-white hover:bg-groupon-green-dark"
                >
                  Schedule a Call
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <MessageSquare className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Live Chat</h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Chat with our support team. Available Mon-Fri, 9AM-6PM CT.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 rounded-lg text-xs"
                >
                  Start Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Chatbot */}
      <Card>
        <div className="border-b border-gray-100 px-4 py-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-groupon-green">
            <MessageSquare className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">Ask Our AI Assistant</span>
          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Beta</span>
        </div>
        <CardContent className="p-0">
          {/* Chat messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-groupon-green text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendChat();
              }}
              placeholder="Ask a question..."
              className="flex-1"
            />
            <Button
              onClick={handleSendChat}
              disabled={!chatMessage.trim()}
              size="icon"
              className="bg-groupon-green text-white hover:bg-groupon-green-dark rounded-lg shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
