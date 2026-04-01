import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { enhanceText, publishDeal, type GeneratedDeal, type MerchantIntake, type DealService, type FinePrint, type VoucherInstructions } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Image,
  Upload,
  Camera,
  Star,
  MapPin,
  Clock,
  ShoppingCart,
  Search,
  ChevronDown,
  Info,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

// ---------- Types ----------

interface ServiceOption {
  name: string;
  regularPrice: string;
  grouponPrice: string;
  discountPct: number;
  voucherCap: string;
  description: string;
}

interface DealFormData {
  // Step 1
  bookingPlatform: string;
  categoryTab: 'ai' | 'search' | 'browse';
  selectedCategory: string;
  categorySearch: string;
  aiCategory: string;
  aiConfidence: number;
  // Step 2
  services: ServiceOption[];
  // Step 3
  photos: string[];
  photoSource: 'upload' | 'stock' | 'professional';
  // Step 4
  highlights: string;
  // Step 5
  descriptions: Record<number, string>;
  // Step 6
  voucherLimit: number;
  expiryDays: number;
  cancellationPolicy: string;
  restrictionNewCustomers: boolean;
  restrictionAppointment: boolean;
  restrictionNoRefund: boolean;
  // Step 7
  redemptionMethod: 'physical' | 'travel' | 'online';
  redemptionAddress: string;
  redemptionCity: string;
  redemptionState: string;
  redemptionZip: string;
  redemptionAppointment: boolean;
  redemptionPhone: string;
  // meta
  businessName: string;
  businessDescription: string;
}

const STEPS = [
  { id: 1, label: 'Initial Setup', short: 'Setup' },
  { id: 2, label: 'Options', short: 'Options' },
  { id: 3, label: 'Photos', short: 'Photos' },
  { id: 4, label: 'Highlights', short: 'Highlights' },
  { id: 5, label: 'Description', short: 'Description' },
  { id: 6, label: 'Fine Print', short: 'Fine Print' },
  { id: 7, label: 'Voucher Instructions', short: 'Voucher' },
  { id: 8, label: 'Review & Publish', short: 'Review' },
];

const MAIN_CATEGORIES = [
  {
    name: 'Health, Beauty & Wellness',
    subs: ['Hair Salons', 'Spas', 'Skin Care', 'Nail Salons', 'Massage', 'Weight Loss', 'Dental', 'Eye Care'],
  },
  {
    name: 'Things to Do',
    subs: ['Activities', 'Tours', 'Events', 'Classes', 'Escape Rooms', 'Amusement Parks'],
  },
  {
    name: 'Home & Auto',
    subs: ['Cleaning', 'Landscaping', 'HVAC', 'Plumbing', 'Auto Detailing', 'Auto Repair'],
  },
  {
    name: 'Restaurants',
    subs: ['Casual Dining', 'Fine Dining', 'Cafes', 'Bakeries', 'Bars'],
  },
  {
    name: 'Retail',
    subs: ['Clothing', 'Electronics', 'Home Goods', 'Gifts', 'Jewelry'],
  },
];

const BOOKING_PLATFORMS = ['None', 'Booker', 'Mindbody', 'Square', 'Vagaro', 'Other'];

function defaultFormData(): DealFormData {
  return {
    bookingPlatform: 'None',
    categoryTab: 'ai',
    selectedCategory: '',
    categorySearch: '',
    aiCategory: 'Health, Beauty & Wellness > Spas',
    aiConfidence: 92,
    services: [
      {
        name: '',
        regularPrice: '',
        grouponPrice: '',
        discountPct: 0,
        voucherCap: '',
        description: '',
      },
    ],
    photos: [],
    photoSource: 'upload',
    highlights: '',
    descriptions: {},
    voucherLimit: 1,
    expiryDays: 90,
    cancellationPolicy: '',
    restrictionNewCustomers: false,
    restrictionAppointment: true,
    restrictionNoRefund: false,
    redemptionMethod: 'physical',
    redemptionAddress: '',
    redemptionCity: '',
    redemptionState: '',
    redemptionZip: '',
    redemptionAppointment: true,
    redemptionPhone: '',
    businessName: '',
    businessDescription: '',
  };
}

// ---------- Component ----------

export function CreateDeal() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<DealFormData>(defaultFormData);
  const [showPreview, setShowPreview] = useState(true);
  const [inspiringField, setInspiringField] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [expandedBrowse, setExpandedBrowse] = useState<string | null>(null);

  // ---- Helpers ----
  function updateForm(partial: Partial<DealFormData>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function updateService(index: number, partial: Partial<ServiceOption>) {
    setForm((prev) => {
      const services = [...prev.services];
      const svc = services[index];
      if (!svc) return prev;
      services[index] = { ...svc, ...partial };

      // Auto-calc discount
      const reg = parseFloat(services[index].regularPrice) || 0;
      const grp = parseFloat(services[index].grouponPrice) || 0;
      if (reg > 0 && grp > 0 && grp < reg) {
        services[index].discountPct = Math.round(((reg - grp) / reg) * 100);
      } else {
        services[index].discountPct = 0;
      }

      return { ...prev, services };
    });
  }

  function addService() {
    setForm((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { name: '', regularPrice: '', grouponPrice: '', discountPct: 0, voucherCap: '', description: '' },
      ],
    }));
  }

  function removeService(index: number) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  }

  async function handleInspireMe(field: 'highlights' | 'description', serviceIndex?: number) {
    const fieldKey = serviceIndex !== undefined ? `description-${serviceIndex}` : field;
    setInspiringField(fieldKey);
    try {
      const currentText =
        field === 'highlights'
          ? form.highlights
          : (serviceIndex !== undefined ? (form.descriptions[serviceIndex] ?? '') : '');

      const result = await enhanceText(currentText, field, {
        business_name: form.businessName,
        category: form.selectedCategory || form.aiCategory,
        services: form.services.map((s) => s.name).filter(Boolean),
      });

      const enhanced = result?.enhanced_text ?? currentText;

      if (field === 'highlights') {
        updateForm({ highlights: enhanced });
      } else if (serviceIndex !== undefined) {
        setForm((prev) => ({
          ...prev,
          descriptions: { ...prev.descriptions, [serviceIndex]: enhanced },
        }));
      }
    } catch {
      // silently fail
    } finally {
      setInspiringField(null);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      const services: DealService[] = form.services
        .filter((s) => s.name)
        .map((s, i) => ({
          name: s.name,
          description: form.descriptions[i] ?? s.description,
          original_price: parseFloat(s.regularPrice) || 0,
          discount_pct: s.discountPct,
          deal_price: parseFloat(s.grouponPrice) || 0,
          voucher_cap: parseInt(s.voucherCap) || undefined,
        }));

      const finePrint: FinePrint = {
        expiry_days: form.expiryDays,
        max_per_person: form.voucherLimit,
        appointment_required: form.restrictionAppointment,
        new_customers_only: form.restrictionNewCustomers,
        restrictions: [
          ...(form.restrictionNoRefund ? ['No refunds after purchase'] : []),
        ],
        cancellation_policy: form.cancellationPolicy,
      };

      const voucherInstructions: VoucherInstructions = {
        redemption_method: form.redemptionMethod,
        appointment_required: form.redemptionAppointment,
        instructions: form.redemptionAddress
          ? `Visit at ${form.redemptionAddress}, ${form.redemptionCity}, ${form.redemptionState} ${form.redemptionZip}`
          : 'Present voucher at location',
      };

      const deal: GeneratedDeal = {
        title: `${form.services[0]?.name ?? 'Deal'} at ${form.businessName || 'Business'}`,
        description: form.descriptions[0] ?? '',
        highlights: form.highlights
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean),
        services,
        fine_print: finePrint,
        voucher_instructions: voucherInstructions,
        category: form.selectedCategory || form.aiCategory,
        scheduling_recommendation: '',
        photo_guidance: '',
        confidence: { title: 0.85, description: 0.85, pricing: 0.9, category: (form.aiConfidence / 100) },
      };

      const intake: MerchantIntake = {
        business_name: form.businessName,
        business_description: form.businessDescription,
        location: `${form.redemptionCity}, ${form.redemptionState}`,
        services: form.services.map((s) => s.name).filter(Boolean).join(', '),
        additional_info: '',
        phone: form.redemptionPhone,
        address: form.redemptionAddress,
      };

      await publishDeal(deal, intake, {
        phone: form.redemptionPhone,
        address: `${form.redemptionAddress}, ${form.redemptionCity}, ${form.redemptionState} ${form.redemptionZip}`,
      });

      navigate('/portal/campaigns');
    } catch {
      // show error inline if needed
    } finally {
      setPublishing(false);
    }
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return Boolean(form.selectedCategory || form.aiCategory);
      case 2:
        return form.services.length > 0 && form.services.some((s) => s.name && s.regularPrice && s.grouponPrice);
      default:
        return true;
    }
  }

  // ---- Render Steps ----

  function renderStep1() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-lg font-bold text-gray-900">Initial Setup</h2>
          <p className="text-sm text-gray-500 mt-1">Choose your booking platform and category.</p>
        </div>

        {/* Business info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Business Name</Label>
            <Input
              value={form.businessName}
              onChange={(e) => updateForm({ businessName: (e.target as HTMLInputElement).value })}
              placeholder="Sofia's Glow Studio"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Business Description</Label>
            <Input
              value={form.businessDescription}
              onChange={(e) => updateForm({ businessDescription: (e.target as HTMLInputElement).value })}
              placeholder="Full-service beauty and wellness spa..."
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Booking platform */}
        <div>
          <Label>Booking Platform</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {BOOKING_PLATFORMS.map((platform) => (
              <button
                key={platform}
                onClick={() => updateForm({ bookingPlatform: platform })}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  form.bookingPlatform === platform
                    ? 'border-groupon-green bg-groupon-green-light text-groupon-green'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Category selection */}
        <div>
          <Label>Category</Label>
          <div className="mt-2 flex gap-1 rounded-lg bg-gray-100 p-1">
            {(['ai', 'search', 'browse'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => updateForm({ categoryTab: tab })}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  form.categoryTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'ai' ? 'AI Recommended' : tab === 'search' ? 'Search' : 'Browse'}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {form.categoryTab === 'ai' && (
              <div className="rounded-xl border border-groupon-green/30 bg-groupon-green-light/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-groupon-green" />
                  <span className="text-sm font-bold text-groupon-green">AI Detected Category</span>
                  <Badge className="bg-groupon-green/10 text-groupon-green border-0 text-[11px]">
                    {form.aiConfidence}% confidence
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-900">{form.aiCategory}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateForm({ selectedCategory: form.aiCategory })}
                    className="rounded-lg bg-groupon-green text-xs font-bold text-white hover:bg-groupon-green-dark"
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateForm({ categoryTab: 'browse' })}
                    className="rounded-lg text-xs"
                  >
                    Change
                  </Button>
                </div>
                {form.selectedCategory === form.aiCategory && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-groupon-green">
                    <CheckCircle2 className="h-3 w-3" /> Category accepted
                  </div>
                )}
              </div>
            )}

            {form.categoryTab === 'search' && (
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={form.categorySearch}
                    onChange={(e) => updateForm({ categorySearch: (e.target as HTMLInputElement).value })}
                    placeholder="Search categories..."
                    className="pl-9"
                  />
                </div>
                {form.categorySearch && (
                  <div className="mt-2 rounded-lg border border-gray-200 divide-y divide-gray-100 max-h-60 overflow-y-auto">
                    {MAIN_CATEGORIES.flatMap((cat) =>
                      cat.subs
                        .filter((sub) =>
                          sub.toLowerCase().includes(form.categorySearch.toLowerCase()) ||
                          cat.name.toLowerCase().includes(form.categorySearch.toLowerCase())
                        )
                        .map((sub) => {
                          const full = `${cat.name} > ${sub}`;
                          return (
                            <button
                              key={full}
                              onClick={() => updateForm({ selectedCategory: full, categorySearch: '' })}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-500">{cat.name}</span>
                              <ChevronRight className="h-3 w-3 text-gray-300" />
                              <span className="font-medium text-gray-900">{sub}</span>
                            </button>
                          );
                        })
                    )}
                  </div>
                )}
              </div>
            )}

            {form.categoryTab === 'browse' && (
              <div className="space-y-1">
                {MAIN_CATEGORIES.map((cat) => (
                  <div key={cat.name}>
                    <button
                      onClick={() => setExpandedBrowse(expandedBrowse === cat.name ? null : cat.name)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {expandedBrowse === cat.name ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                      {cat.name}
                    </button>
                    {expandedBrowse === cat.name && (
                      <div className="ml-6 space-y-0.5">
                        {cat.subs.map((sub) => {
                          const full = `${cat.name} > ${sub}`;
                          return (
                            <button
                              key={full}
                              onClick={() => updateForm({ selectedCategory: full })}
                              className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                                form.selectedCategory === full
                                  ? 'bg-groupon-green-light text-groupon-green font-medium'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {form.selectedCategory && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-groupon-green" />
              <span className="text-gray-600">Selected:</span>
              <span className="font-medium text-gray-900">{form.selectedCategory}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-lg font-bold text-gray-900">Service Options</h2>
          <p className="text-sm text-gray-500 mt-1">Add the services you want to offer on Groupon.</p>
        </div>

        {form.services.map((svc, i) => (
          <Card key={i}>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Option {i + 1}</CardTitle>
                {form.services.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeService(i)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Service Name</Label>
                  <Input
                    value={svc.name}
                    onChange={(e) => updateService(i, { name: (e.target as HTMLInputElement).value })}
                    placeholder="60-Minute Deep Tissue Massage"
                    className="mt-1.5"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Regular Price ($)</Label>
                    <Input
                      type="number"
                      value={svc.regularPrice}
                      onChange={(e) => updateService(i, { regularPrice: (e.target as HTMLInputElement).value })}
                      placeholder="120"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Groupon Price ($)</Label>
                    <Input
                      type="number"
                      value={svc.grouponPrice}
                      onChange={(e) => updateService(i, { grouponPrice: (e.target as HTMLInputElement).value })}
                      placeholder="72"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Discount</Label>
                    <div className="mt-1.5 flex h-8 items-center rounded-lg border border-input bg-gray-50 px-3 text-sm font-bold text-groupon-green">
                      {svc.discountPct > 0 ? `${svc.discountPct}% Off` : '--'}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Voucher Cap (optional)</Label>
                  <Input
                    type="number"
                    value={svc.voucherCap}
                    onChange={(e) => updateService(i, { voucherCap: (e.target as HTMLInputElement).value })}
                    placeholder="Unlimited"
                    className="mt-1.5 max-w-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" onClick={addService} className="rounded-lg w-full border-dashed">
          <Plus className="mr-2 h-4 w-4" />
          Add Another Option
        </Button>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-lg font-bold text-gray-900">Photos</h2>
          <p className="text-sm text-gray-500 mt-1">Add photos to showcase your services.</p>
        </div>

        {/* Source selection */}
        <div className="flex gap-3">
          {([
            { id: 'upload', label: 'Upload Photos', icon: Upload },
            { id: 'stock', label: 'Stock Photos', icon: Image },
            { id: 'professional', label: 'Hire Photographer', icon: Camera },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => updateForm({ photoSource: id })}
              className={`flex-1 flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                form.photoSource === id
                  ? 'border-groupon-green bg-groupon-green-light/30'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`h-6 w-6 ${form.photoSource === id ? 'text-groupon-green' : 'text-gray-400'}`} />
              <span className={`text-xs font-medium ${form.photoSource === id ? 'text-groupon-green' : 'text-gray-600'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Upload area */}
        {form.photoSource === 'upload' && (
          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <Upload className="mx-auto h-10 w-10 text-gray-300 mb-4" />
            <p className="text-sm font-medium text-gray-700">Drag and drop photos here</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
            <Button variant="outline" className="mt-4 rounded-lg text-xs">
              Choose Files
            </Button>
          </div>
        )}

        {/* Stock photos */}
        {form.photoSource === 'stock' && (
          <div>
            <Input placeholder="Search stock photos..." className="mb-4" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-groupon-green transition-all"
                >
                  <Camera className="h-8 w-8 text-gray-300" />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">Stock photo selection - placeholder for demo</p>
          </div>
        )}

        {/* Professional */}
        {form.photoSource === 'professional' && (
          <Card>
            <CardContent>
              <div className="text-center py-4">
                <Camera className="mx-auto h-10 w-10 text-groupon-green mb-3" />
                <h3 className="font-heading text-sm font-bold text-gray-900">Professional Photography</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Groupon partners with professional photographers. A session will be scheduled after your campaign goes live.
                </p>
                <Badge className="mt-3 bg-groupon-green/10 text-groupon-green border-0 text-xs">
                  Included Free
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  function renderStep4() {
    const charCount = form.highlights.length;
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-lg font-bold text-gray-900">Highlights</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tell customers what makes your service special. Each line becomes a highlight bullet point.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Highlights</Label>
            <span className={`text-xs ${charCount > 450 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
              {charCount}/450
            </span>
          </div>
          <Textarea
            value={form.highlights}
            onChange={(e) => updateForm({ highlights: (e.target as HTMLTextAreaElement).value })}
            placeholder="Licensed therapists with 10+ years of experience&#10;Premium organic products used&#10;Private treatment rooms&#10;Complimentary refreshments"
            rows={6}
            maxLength={450}
          />
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleInspireMe('highlights')}
              disabled={inspiringField === 'highlights'}
              className="rounded-lg text-xs"
            >
              {inspiringField === 'highlights' ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="mr-1 h-3 w-3" />
              )}
              Inspire Me
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg text-xs">
              <Info className="mr-1 h-3 w-3" />
              Share More Details
            </Button>
          </div>
        </div>

        {/* Preview of highlights */}
        {form.highlights && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Preview</h4>
            <ul className="space-y-1.5">
              {form.highlights.split('\n').filter(Boolean).map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-groupon-green" />
                  {line.trim()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  function renderStep5() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-lg font-bold text-gray-900">Description</h2>
          <p className="text-sm text-gray-500 mt-1">Write a detailed description for each service option.</p>
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-6">
          <div className="space-y-4">
            {form.services.filter((s) => s.name).map((svc, i) => (
              <Card key={i}>
                <CardHeader className="border-b">
                  <CardTitle className="text-sm font-bold">{svc.name || `Option ${i + 1}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={form.descriptions[i] ?? ''}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        descriptions: { ...prev.descriptions, [i]: (e.target as HTMLTextAreaElement).value },
                      }))
                    }
                    placeholder="Describe this service in detail. What does the customer get? What's the experience like?"
                    rows={4}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInspireMe('description', i)}
                    disabled={inspiringField === `description-${i}`}
                    className="mt-2 rounded-lg text-xs"
                  >
                    {inspiringField === `description-${i}` ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1 h-3 w-3" />
                    )}
                    Inspire Me
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Guidelines sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-xs font-bold text-groupon-green">Essential Info</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-groupon-green" />
                    What the service includes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-groupon-green" />
                    Duration of the service
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-groupon-green" />
                    Products or techniques used
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-groupon-green" />
                    What to expect during the visit
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-xs font-bold text-gray-500">Non-Essential</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li>-- Company history</li>
                  <li>-- Promotional language</li>
                  <li>-- Pricing details (shown separately)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  function renderStep6() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-lg font-bold text-gray-900">Fine Print</h2>
          <p className="text-sm text-gray-500 mt-1">Set the terms and conditions for your deal.</p>
        </div>

        {/* Voucher limit */}
        <div>
          <Label>Voucher Limit Per Customer</Label>
          <div className="mt-2 flex gap-3">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => updateForm({ voucherLimit: n })}
                className={`flex h-10 w-16 items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors ${
                  form.voucherLimit === n
                    ? 'border-groupon-green bg-groupon-green-light text-groupon-green'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Expiry */}
        <div>
          <Label>Voucher Expiry</Label>
          <div className="mt-2 flex gap-3">
            {[30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => updateForm({ expiryDays: days })}
                className={`relative flex h-10 items-center justify-center rounded-lg border-2 px-5 text-sm font-bold transition-colors ${
                  form.expiryDays === days
                    ? 'border-groupon-green bg-groupon-green-light text-groupon-green'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {days} days
                {days === 90 && (
                  <Badge className="absolute -top-2 -right-2 bg-groupon-green text-white text-[9px] px-1.5">
                    Recommended
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cancellation policy */}
        <div>
          <Label>Cancellation Policy</Label>
          <Textarea
            value={form.cancellationPolicy}
            onChange={(e) => updateForm({ cancellationPolicy: (e.target as HTMLTextAreaElement).value })}
            placeholder="24-hour cancellation policy. No-shows will forfeit their voucher."
            rows={3}
            className="mt-1.5"
          />
        </div>

        {/* Restrictions */}
        <div>
          <Label>Optional Restrictions</Label>
          <div className="mt-2 space-y-2">
            {[
              { key: 'restrictionNewCustomers' as const, label: 'New customers only' },
              { key: 'restrictionAppointment' as const, label: 'Appointment required' },
              { key: 'restrictionNoRefund' as const, label: 'No refunds after purchase' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => updateForm({ [key]: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-groupon-green focus:ring-groupon-green"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderStep7() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-lg font-bold text-gray-900">Voucher Instructions</h2>
          <p className="text-sm text-gray-500 mt-1">Tell customers how to redeem their voucher.</p>
        </div>

        {/* Redemption method */}
        <div>
          <Label>Redemption Method</Label>
          <div className="mt-2 flex gap-3">
            {([
              { id: 'physical', label: 'In Person' },
              { id: 'travel', label: 'Travel / On-site' },
              { id: 'online', label: 'Online' },
            ] as const).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => updateForm({ redemptionMethod: id })}
                className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  form.redemptionMethod === id
                    ? 'border-groupon-green bg-groupon-green-light text-groupon-green'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        {form.redemptionMethod !== 'online' && (
          <div className="space-y-4">
            <div>
              <Label>Address</Label>
              <Input
                value={form.redemptionAddress}
                onChange={(e) => updateForm({ redemptionAddress: (e.target as HTMLInputElement).value })}
                placeholder="123 Main Street"
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={form.redemptionCity}
                  onChange={(e) => updateForm({ redemptionCity: (e.target as HTMLInputElement).value })}
                  placeholder="Chicago"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={form.redemptionState}
                  onChange={(e) => updateForm({ redemptionState: (e.target as HTMLInputElement).value })}
                  placeholder="IL"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>ZIP</Label>
                <Input
                  value={form.redemptionZip}
                  onChange={(e) => updateForm({ redemptionZip: (e.target as HTMLInputElement).value })}
                  placeholder="60601"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* Appointment toggle */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.redemptionAppointment}
              onChange={(e) => updateForm({ redemptionAppointment: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-groupon-green focus:ring-groupon-green"
            />
            <span className="text-sm text-gray-700">Appointment required for redemption</span>
          </label>
        </div>

        {/* Phone */}
        <div>
          <Label>Phone Number</Label>
          <Input
            value={form.redemptionPhone}
            onChange={(e) => updateForm({ redemptionPhone: (e.target as HTMLInputElement).value })}
            placeholder="(312) 555-0123"
            className="mt-1.5 max-w-[280px]"
          />
        </div>
      </div>
    );
  }

  function renderStep8() {
    const activeServices = form.services.filter((s) => s.name);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-lg font-bold text-gray-900">Review & Publish</h2>
          <p className="text-sm text-gray-500 mt-1">Review all details before publishing your deal.</p>
        </div>

        {/* Summary sections */}
        <div className="space-y-4">
          {/* Setup */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Setup</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs text-groupon-green">
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Business:</span>{' '}
                  <span className="font-medium">{form.businessName || '--'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>{' '}
                  <span className="font-medium">{form.selectedCategory || form.aiCategory || '--'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Booking:</span>{' '}
                  <span className="font-medium">{form.bookingPlatform}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Options ({activeServices.length})</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-xs text-groupon-green">
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeServices.map((svc, i) => (
                <div key={i} className={`flex items-center justify-between py-2 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                  <span className="text-sm font-medium">{svc.name}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400 line-through">${svc.regularPrice}</span>
                    <span className="font-bold text-groupon-green">${svc.grouponPrice}</span>
                    {svc.discountPct > 0 && (
                      <Badge className="bg-groupon-green/10 text-groupon-green border-0 text-[11px]">
                        {svc.discountPct}% Off
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Highlights */}
          {form.highlights && (
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Highlights</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setStep(4)} className="text-xs text-groupon-green">
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {form.highlights.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-groupon-green" />
                      {line.trim()}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Fine Print */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Fine Print</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setStep(6)} className="text-xs text-groupon-green">
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Limit {form.voucherLimit} per person</p>
                <p>Expires {form.expiryDays} days after purchase</p>
                {form.restrictionAppointment && <p>Appointment required</p>}
                {form.restrictionNewCustomers && <p>New customers only</p>}
                {form.cancellationPolicy && <p>Cancellation: {form.cancellationPolicy}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Redemption */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Redemption</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setStep(7)} className="text-xs text-groupon-green">
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Method: {form.redemptionMethod}</p>
                {form.redemptionAddress && (
                  <p>
                    {form.redemptionAddress}, {form.redemptionCity}, {form.redemptionState} {form.redemptionZip}
                  </p>
                )}
                {form.redemptionPhone && <p>Phone: {form.redemptionPhone}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Publish button */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            onClick={handlePublish}
            disabled={publishing}
            className="rounded-lg bg-groupon-green px-8 font-bold text-white hover:bg-groupon-green-dark"
          >
            {publishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish Campaign'
            )}
          </Button>
          <Button variant="outline" onClick={() => navigate('/portal/campaigns')} className="rounded-lg">
            Save as Draft
          </Button>
        </div>
      </div>
    );
  }

  // ---- Live Preview ----
  function renderLivePreview() {
    const activeServices = form.services.filter((s) => s.name);
    const highlightLines = form.highlights.split('\n').filter(Boolean);

    return (
      <div className="w-[320px] shrink-0">
        <div className="sticky top-20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase">Customer Preview</h3>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? 'Hide preview' : 'Show preview'}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          {showPreview && (
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              {/* Photo placeholder */}
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Camera className="h-10 w-10 text-gray-300" />
              </div>

              <div className="p-4 space-y-3">
                {/* Title */}
                <h4 className="font-heading text-sm font-bold text-gray-900 leading-snug">
                  {activeServices[0]?.name
                    ? `${activeServices[0].name} at ${form.businessName || 'Your Business'}`
                    : 'Your Deal Title'}
                </h4>

                {/* Business */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-groupon-green">{form.businessName || 'Business Name'}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                    <Star className="h-3 w-3 text-gray-300" />
                  </div>
                </div>

                {/* Options */}
                {activeServices.length > 0 && (
                  <div className="space-y-2">
                    {activeServices.map((svc, i) => (
                      <div key={i} className="rounded-lg border border-gray-100 p-2.5">
                        <p className="text-xs font-medium text-gray-900">{svc.name}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          {svc.regularPrice && (
                            <span className="text-[11px] text-gray-400 line-through">${svc.regularPrice}</span>
                          )}
                          {svc.grouponPrice && (
                            <span className="text-sm font-extrabold text-groupon-green">${svc.grouponPrice}</span>
                          )}
                          {svc.discountPct > 0 && (
                            <Badge className="bg-groupon-green/10 text-groupon-green border-0 text-[9px]">
                              {svc.discountPct}% Off
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlights */}
                {highlightLines.length > 0 && (
                  <div className="rounded-lg bg-gray-50 p-2.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Highlights</p>
                    <ul className="space-y-1">
                      {highlightLines.slice(0, 3).map((line, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-groupon-green" />
                          {line.trim()}
                        </li>
                      ))}
                      {highlightLines.length > 3 && (
                        <li className="text-[11px] text-gray-400">+{highlightLines.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Location */}
                {(form.redemptionAddress || form.redemptionCity) && (
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {form.redemptionAddress ? `${form.redemptionAddress}, ` : ''}
                      {form.redemptionCity} {form.redemptionState}
                    </span>
                  </div>
                )}

                {/* Buy button */}
                <Button className="w-full h-9 rounded-lg bg-groupon-green text-xs font-bold text-white hover:bg-groupon-green-dark">
                  <ShoppingCart className="mr-1 h-3 w-3" />
                  Buy Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- Main Render ----
  const stepRenderers: Record<number, () => React.ReactNode> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
    5: renderStep5,
    6: renderStep6,
    7: renderStep7,
    8: renderStep8,
  };

  return (
    <div className="animate-fade-in-up p-6">
      <div className="flex gap-6">
        {/* Step sidebar */}
        <div className="w-[200px] shrink-0">
          <div className="sticky top-20">
            <h2 className="font-heading text-sm font-bold text-gray-900 mb-4">Create Campaign</h2>
            <nav className="space-y-0.5">
              {STEPS.map((s) => {
                const isActive = s.id === step;
                const isDone = s.id < step;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-groupon-green-light text-groupon-green font-medium'
                        : isDone
                          ? 'text-gray-600 hover:bg-gray-50'
                          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-groupon-green" />
                    ) : (
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-groupon-green text-white'
                            : 'border border-gray-300 text-gray-400'
                        }`}
                      >
                        {s.id}
                      </div>
                    )}
                    <span className="truncate">{s.short}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 max-w-2xl">
          {/* Step content */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            {stepRenderers[step]?.()}
          </div>

          {/* Navigation */}
          {step < 8 && (
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="rounded-lg"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <div className="text-xs text-gray-400">
                Step {step} of {STEPS.length}
              </div>
              <Button
                onClick={() => setStep(Math.min(8, step + 1))}
                className="rounded-lg bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
              >
                Continue
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Live preview */}
        {step <= 7 && renderLivePreview()}
      </div>
    </div>
  );
}
