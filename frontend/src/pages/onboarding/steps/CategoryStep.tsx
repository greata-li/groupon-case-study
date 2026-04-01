import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sparkles,
  Search,
  Layers,
  Check,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

interface CategoryStepProps {
  data: Record<string, unknown>;
  onUpdate: (field: string, value: unknown) => void;
}

// Flat list for search
const ALL_CATEGORIES = [
  'Full Body Massage',
  'Swedish Massage',
  'Deep Tissue Massage',
  'Hot Stone Massage',
  'Brazilian Wax',
  'Lash Extensions',
  'Hair Salon Services',
  'Facial',
  'Manicure',
  'Pedicure',
  'Dental Cleaning',
  'Oil Change',
  'Escape Room',
  'Restaurant',
  'Yoga Class',
  'Personal Training',
  'Photography Session',
];

// Hierarchical data for manual selection
const CATEGORY_TREE: Record<string, Record<string, string[]>> = {
  'Health / Beauty / Wellness': {
    'Massage Services': ['Full Body Massage', 'Swedish Massage', 'Deep Tissue Massage', 'Hot Stone Massage'],
    'Hair Salon': ['Haircut', 'Hair Coloring', 'Blowout', 'Keratin Treatment'],
    'Waxing': ['Brazilian Wax', 'Eyebrow Wax', 'Full Leg Wax', 'Underarm Wax'],
    'Lash Extensions': ['Classic Lash Extensions', 'Volume Lash Extensions', 'Lash Lift & Tint'],
    'Spa': ['Facial', 'Body Wrap', 'Aromatherapy', 'Sauna Session'],
    'Dental': ['Dental Cleaning', 'Teeth Whitening', 'Dental Exam'],
    'Chiropractic': ['Adjustment Session', 'Spinal Decompression', 'Posture Assessment'],
  },
  'Things to Do': {
    'Entertainment': ['Escape Room', 'Bowling', 'Laser Tag', 'Movie Tickets'],
    'Classes & Workshops': ['Yoga Class', 'Cooking Class', 'Art Workshop', 'Dance Class'],
    'Tours & Activities': ['City Tour', 'Wine Tasting', 'Boat Tour', 'Zip Line'],
  },
  'Home & Auto': {
    'Auto Services': ['Oil Change', 'Tire Rotation', 'Car Wash & Detail', 'Brake Inspection'],
    'Home Services': ['House Cleaning', 'Carpet Cleaning', 'HVAC Service', 'Pest Control'],
  },
  'Restaurants': {
    'Dining': ['Restaurant', 'Prix Fixe Dinner', 'Brunch', 'Buffet'],
    'Drinks': ['Wine Bar', 'Cocktail Experience', 'Beer Tasting'],
  },
  'Retail': {
    'Shopping': ['Gift Cards', 'Clothing', 'Electronics', 'Home Goods'],
    'Health Products': ['Supplements', 'Skincare', 'Wellness Products'],
  },
};

function getAiCategory(description: string | undefined): { category: string; confidence: number } | null {
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return null;
  }
  const lower = description.toLowerCase();
  if (lower.includes('massage') || lower.includes('spa')) {
    return { category: 'Full Body Massage', confidence: 92 };
  }
  if (lower.includes('hair') || lower.includes('salon')) {
    return { category: 'Hair Salon Services', confidence: 88 };
  }
  if (lower.includes('lash') || lower.includes('eyelash')) {
    return { category: 'Lash Extensions', confidence: 90 };
  }
  if (lower.includes('wax')) {
    return { category: 'Brazilian Wax', confidence: 85 };
  }
  if (lower.includes('facial') || lower.includes('skin')) {
    return { category: 'Facial', confidence: 87 };
  }
  if (lower.includes('nail') || lower.includes('manicure')) {
    return { category: 'Manicure', confidence: 89 };
  }
  if (lower.includes('yoga') || lower.includes('fitness')) {
    return { category: 'Yoga Class', confidence: 86 };
  }
  if (lower.includes('dental') || lower.includes('teeth')) {
    return { category: 'Dental Cleaning', confidence: 91 };
  }
  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('dining')) {
    return { category: 'Restaurant', confidence: 84 };
  }
  if (lower.includes('photo')) {
    return { category: 'Photography Session', confidence: 83 };
  }
  if (lower.includes('escape')) {
    return { category: 'Escape Room', confidence: 94 };
  }
  if (lower.includes('oil change') || lower.includes('auto')) {
    return { category: 'Oil Change', confidence: 88 };
  }
  if (lower.includes('train') || lower.includes('personal')) {
    return { category: 'Personal Training', confidence: 85 };
  }
  // Fallback
  return { category: 'Full Body Massage', confidence: 62 };
}

export function CategoryStep({ data, onUpdate }: CategoryStepProps) {
  const [activeTab, setActiveTab] = useState('ai');
  const [searchQuery, setSearchQuery] = useState('');
  const [manualLevel, setManualLevel] = useState<0 | 1 | 2>(0);
  const [selectedMain, setSelectedMain] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const currentCategory = (data.category as string) || '';

  const aiResult = useMemo(
    () => getAiCategory(data.business_description as string | undefined),
    [data.business_description]
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return ALL_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return ALL_CATEGORIES.filter((cat) => cat.toLowerCase().includes(q));
  }, [searchQuery]);

  function selectCategory(cat: string) {
    onUpdate('category', cat);
  }

  // Manual navigation
  const mainCategories = Object.keys(CATEGORY_TREE);
  const subCategories = selectedMain ? Object.keys(CATEGORY_TREE[selectedMain] ?? {}) : [];
  const services =
    selectedMain && selectedSub
      ? CATEGORY_TREE[selectedMain]?.[selectedSub] ?? []
      : [];

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-gray-900">
        Campaign category on Groupon
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500">
        Choose the category that best describes the service you'll be offering.
        This helps customers find your deal on Groupon.
      </p>

      {/* Current selection indicator */}
      {currentCategory && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-groupon-green-light px-3 py-2">
          <Check className="h-4 w-4 text-groupon-green" />
          <span className="text-sm font-medium text-groupon-green-dark">
            Selected: {currentCategory}
          </span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as string)} className="mt-6">
        <TabsList variant="line" className="mb-6">
          <TabsTrigger value="ai" className="gap-1.5 px-3">
            <Sparkles className="h-3.5 w-3.5" />
            AI Recommended
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-1.5 px-3">
            <Search className="h-3.5 w-3.5" />
            Search category
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-1.5 px-3">
            <Layers className="h-3.5 w-3.5" />
            Manual Selection
          </TabsTrigger>
        </TabsList>

        {/* AI Recommended */}
        <TabsContent value="ai">
          {aiResult ? (
            <Card className="border-groupon-green/20 bg-groupon-green-light/20">
              <CardContent className="pt-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-groupon-green/10">
                    <Sparkles className="h-6 w-6 text-groupon-green" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading text-lg font-bold text-gray-900">
                        {aiResult.category}
                      </h3>
                      <Badge
                        className={`border-0 text-xs font-semibold ${
                          aiResult.confidence >= 80
                            ? 'bg-groupon-green/10 text-groupon-green'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {aiResult.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Based on your business description, we recommend this category.
                      {aiResult.confidence < 80 && ' You may want to search for a more specific category.'}
                    </p>
                    <Button
                      onClick={() => selectCategory(aiResult.category)}
                      className={`mt-4 rounded-lg font-bold text-white transition-all ${
                        currentCategory === aiResult.category
                          ? 'bg-groupon-green-dark'
                          : 'bg-groupon-green hover:bg-groupon-green-dark'
                      }`}
                      size="sm"
                    >
                      {currentCategory === aiResult.category ? (
                        <>
                          <Check className="mr-1 h-3.5 w-3.5" />
                          Accepted
                        </>
                      ) : (
                        'Accept this category'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="pt-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  <div>
                    <h3 className="font-heading text-sm font-bold text-gray-900">
                      No recommendation available
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add a business description first so we can recommend the best category.
                      Go back to the "Describe your business" step, or use the Search or Manual tabs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Search */}
        <TabsContent value="search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
              placeholder="Search for a category..."
              className="h-10 pl-10 rounded-lg"
            />
          </div>
          <div className="mt-4 max-h-80 space-y-1 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2">
            {searchResults.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No categories match your search.
              </p>
            ) : (
              searchResults.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    currentCategory === cat
                      ? 'bg-groupon-green-light text-groupon-green-dark font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      currentCategory === cat
                        ? 'border-groupon-green bg-groupon-green'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {currentCategory === cat && <Check className="h-3 w-3 text-white" />}
                  </div>
                  {cat}
                </button>
              ))
            )}
          </div>
        </TabsContent>

        {/* Manual Selection */}
        <TabsContent value="manual">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-1 text-sm text-gray-400">
            <button
              onClick={() => {
                setManualLevel(0);
                setSelectedMain(null);
                setSelectedSub(null);
              }}
              className={`transition-colors ${manualLevel >= 0 ? 'text-gray-600 hover:text-groupon-green font-medium' : ''}`}
            >
              Categories
            </button>
            {selectedMain && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <button
                  onClick={() => {
                    setManualLevel(1);
                    setSelectedSub(null);
                  }}
                  className={`transition-colors ${manualLevel >= 1 ? 'text-gray-600 hover:text-groupon-green font-medium' : ''}`}
                >
                  {selectedMain}
                </button>
              </>
            )}
            {selectedSub && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium text-gray-900">{selectedSub}</span>
              </>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            {/* Level 0: Main categories */}
            {manualLevel === 0 && (
              <div className="divide-y divide-gray-100">
                {mainCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedMain(cat);
                      setManualLevel(1);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-gray-50"
                  >
                    <span className="text-sm font-medium text-gray-900">{cat}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Level 1: Subcategories */}
            {manualLevel === 1 && selectedMain && (
              <div>
                <button
                  onClick={() => {
                    setManualLevel(0);
                    setSelectedMain(null);
                  }}
                  className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-2.5 text-left text-xs font-medium text-gray-500 hover:text-groupon-green transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to categories
                </button>
                <div className="divide-y divide-gray-100">
                  {subCategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setSelectedSub(sub);
                        setManualLevel(2);
                      }}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-gray-50"
                    >
                      <span className="text-sm font-medium text-gray-900">{sub}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Level 2: Services */}
            {manualLevel === 2 && selectedMain && selectedSub && (
              <div>
                <button
                  onClick={() => {
                    setManualLevel(1);
                    setSelectedSub(null);
                  }}
                  className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-2.5 text-left text-xs font-medium text-gray-500 hover:text-groupon-green transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to {selectedMain}
                </button>
                <div className="divide-y divide-gray-100">
                  {services.map((svc) => (
                    <button
                      key={svc}
                      onClick={() => selectCategory(svc)}
                      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                        currentCategory === svc
                          ? 'bg-groupon-green-light'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          currentCategory === svc
                            ? 'border-groupon-green bg-groupon-green'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {currentCategory === svc && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={`text-sm ${
                        currentCategory === svc ? 'font-medium text-groupon-green-dark' : 'text-gray-900'
                      }`}>
                        {svc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
