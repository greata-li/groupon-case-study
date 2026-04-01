import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  BookOpen,
  CreditCard,
  Ticket,
  TrendingUp,
  Settings,
  HelpCircle,
  MessageCircle,
  Phone,
  ExternalLink,
} from 'lucide-react';

const supportCategories = [
  { label: 'Prepare Your Business', icon: BookOpen, articles: 4 },
  { label: 'Launch Your Campaign', icon: TrendingUp, articles: 6 },
  { label: 'Redemption & Managing', icon: Ticket, articles: 5 },
  { label: 'Merchant Tools', icon: Settings, articles: 3 },
  { label: 'Financials', icon: CreditCard, articles: 4 },
  { label: 'Promotional Programs', icon: HelpCircle, articles: 2 },
];

const popularArticles = [
  'Making Changes to Your Groupon Campaign',
  'How Groupon Payments Work',
  'Updating Your Banking Information',
  'Payment Processing',
  'How To Redeem Groupon Vouchers',
  'Creating New Campaigns',
];

export function Support() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="font-heading text-3xl font-extrabold text-groupon-green">GROUPON</span>
        <h1 className="font-heading text-2xl font-bold text-gray-900 mt-2">Welcome</h1>
        <p className="text-sm text-gray-500 mt-1">Search for answers or browse help topics</p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords and articles"
            className="h-12 rounded-xl pl-11 text-sm"
          />
        </div>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        {/* Merchant Support Topics */}
        <div>
          <h3 className="font-heading text-sm font-bold text-gray-900 mb-3">
            Merchant Support Topics
          </h3>
          <ul className="space-y-2">
            {supportCategories.map((cat) => (
              <li key={cat.label}>
                <button className="flex items-center gap-2 text-sm text-groupon-green hover:underline">
                  <cat.icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Support Articles */}
        <div>
          <h3 className="font-heading text-sm font-bold text-gray-900 mb-3">
            Popular Support Articles
          </h3>
          <ul className="space-y-2">
            {popularArticles.map((article) => (
              <li key={article}>
                <button className="text-sm text-groupon-green hover:underline text-left">
                  {article}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Other Resources */}
        <div>
          <h3 className="font-heading text-sm font-bold text-gray-900 mb-3">
            Other Resources
          </h3>
          <ul className="space-y-2">
            {['Merchant Support', 'Video Tutorials', 'Merchant Blog', 'Consumer Support'].map(
              (item) => (
                <li key={item}>
                  <button className="flex items-center gap-1 text-sm text-groupon-green hover:underline">
                    {item}
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="py-6 text-center">
            <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-gray-900">Support</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Everyone needs help sometimes. Visit our Merchant Help Center.
            </p>
            <Button variant="outline" className="rounded-lg text-sm">
              Visit
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 text-center">
            <Phone className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-gray-900">
              Contact Sales Representative
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Have questions or need help? We'll connect you with your dedicated representative.
            </p>
            <Button className="rounded-lg bg-groupon-green text-sm font-bold text-white hover:bg-groupon-green-dark">
              Request Assistance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
