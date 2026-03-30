import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GeneratedDeal, PipelineResult, MerchantIntake, FinePrint } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  MapPin,
  Clock,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Eye,
  ChevronDown,
  ChevronUp,
  Camera,
  Share2,
  Heart,
  Phone,
  Globe,
  MapPinned,
  Ticket,
  CheckCircle2,
  ShieldCheck,
  FileText,
  DollarSign,
  Store,
  Send,
} from 'lucide-react';

// --- Tabs for the deal builder ---

type DealTab = 'listing' | 'pricing' | 'terms' | 'redemption' | 'business' | 'review';

const tabs: { id: DealTab; label: string; icon: React.ElementType }[] = [
  { id: 'listing', label: 'Deal Listing', icon: FileText },
  { id: 'pricing', label: 'Pricing & Options', icon: DollarSign },
  { id: 'terms', label: 'Terms & Fine Print', icon: ShieldCheck },
  { id: 'redemption', label: 'Redemption', icon: Ticket },
  { id: 'business', label: 'Business Profile', icon: Store },
  { id: 'review', label: 'Review & Publish', icon: Send },
];

interface DealPreviewProps {
  result: PipelineResult;
  intake: MerchantIntake;
  onPublish: () => void;
}

export function DealPreview({ result, intake, onPublish }: DealPreviewProps) {
  const navigate = useNavigate();
  const [deal, setDeal] = useState<GeneratedDeal>(() => normalizeDeal(result.deal));
  const [activeTab, setActiveTab] = useState<DealTab>('listing');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showPipeline, setShowPipeline] = useState(false);

  // Contact/business details (pre-filled from intake)
  const [contactPhone, setContactPhone] = useState(intake.phone || '');
  const [contactAddress, setContactAddress] = useState(intake.address || intake.location);
  const [contactWebsite, setContactWebsite] = useState(intake.website || '');
  const [businessType, setBusinessType] = useState('sole_provider');

  function startEdit(field: string, value: string) {
    setEditingField(field);
    setEditValue(value);
  }

  function saveEdit(field: string) {
    setDeal({ ...deal, [field]: editValue });
    setEditingField(null);
  }

  function cancelEdit() {
    setEditingField(null);
  }

  function updateHighlight(index: number, value: string) {
    const updated = [...(deal.highlights || [])];
    updated[index] = value;
    setDeal({ ...deal, highlights: updated });
  }

  // Fine print
  const finePrint = deal.fine_print;
  const isStructuredFinePrint = typeof finePrint === 'object' && finePrint !== null;
  const finePrintObj = isStructuredFinePrint ? (finePrint as FinePrint) : null;
  const finePrintText = isStructuredFinePrint
    ? formatStructuredFinePrint(finePrint as FinePrint)
    : String(finePrint || '');

  const services = deal.services || [];
  const highlights = deal.highlights || [];
  const confidence = deal.confidence || {};
  const flags = deal.flags || [];
  const voucher = deal.voucher_instructions;

  // Completion check for each tab
  const tabComplete: Record<DealTab, boolean> = {
    listing: !!(deal.title && deal.description && highlights.length > 0),
    pricing: services.length > 0,
    terms: !!finePrintText,
    redemption: !!voucher,
    business: !!(contactPhone && contactAddress),
    review: false,
  };

  return (
    <div className="animate-fade-in-up mx-auto max-w-6xl px-6 py-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 text-groupon-green" />
          <div>
            <h2 className="font-heading text-xl font-bold text-gray-900">Deal Builder</h2>
            <p className="text-sm text-gray-500">
              Your deal is ready to review. Go through each section, edit anything, then publish.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/create')}
            className="rounded-lg border-gray-300 text-sm"
          >
            Start Over
          </Button>
          <Button
            onClick={onPublish}
            className="rounded-lg bg-groupon-green px-6 font-bold text-white shadow-md shadow-groupon-green/20 hover:bg-groupon-green-dark"
          >
            Publish Deal
          </Button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isComplete = tabComplete[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-groupon-green text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {isComplete && !isActive ? (
                <CheckCircle2 className="h-4 w-4 text-groupon-green" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="min-h-[500px]">
        {/* ===== LISTING TAB ===== */}
        {activeTab === 'listing' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <div className="text-sm text-gray-400">
                {(deal.category || 'Beauty & Spas').replace(' > ', ' \u203A ')}
              </div>

              <EditableField
                value={deal.title || 'Untitled Deal'}
                editing={editingField === 'title'}
                confidence={confidence.title}
                onStartEdit={() => startEdit('title', deal.title || '')}
                onSave={() => saveEdit('title')}
                onCancel={cancelEdit}
                editValue={editValue}
                onEditChange={setEditValue}
                renderDisplay={(value) => (
                  <h1 className="font-heading text-[1.5rem] font-bold leading-snug text-gray-900">
                    {value}
                  </h1>
                )}
              />

              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-groupon-green">{intake.business_name}</span>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-gray-400">New Business</span>
              </div>

              {/* Image */}
              <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50">
                <div className="flex h-56 flex-col items-center justify-center gap-3">
                  <div className="rounded-2xl bg-white p-4 shadow-lg shadow-gray-900/5">
                    <Camera className="h-7 w-7 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    {deal.photo_guidance || 'Upload a photo of your business'}
                  </p>
                  <p className="text-xs text-gray-400">Photos will be added before publishing</p>
                </div>
                <div className="absolute right-4 top-4 flex gap-2">
                  <div className="rounded-full bg-white/90 p-2 shadow-sm">
                    <Share2 className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="rounded-full bg-white/90 p-2 shadow-sm">
                    <Heart className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-heading text-base font-bold text-gray-900">About This Deal</h3>
                <div className="mt-2">
                  <EditableField
                    value={deal.description || 'No description generated.'}
                    editing={editingField === 'description'}
                    confidence={confidence.description}
                    onStartEdit={() => startEdit('description', deal.description || '')}
                    onSave={() => saveEdit('description')}
                    onCancel={cancelEdit}
                    editValue={editValue}
                    onEditChange={setEditValue}
                    multiline
                    renderDisplay={(value) => (
                      <p className="text-[15px] leading-relaxed text-gray-600">{value}</p>
                    )}
                  />
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h3 className="font-heading text-base font-bold text-gray-900 mb-3">Highlights</h3>
                {highlights.length > 0 ? (
                  <div className="space-y-2">
                    {highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 group">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-groupon-green" />
                        <input
                          value={h}
                          onChange={(e) => updateHighlight(i, e.target.value)}
                          className="flex-1 border-0 bg-transparent text-[15px] text-gray-600 outline-none focus:ring-0 hover:bg-gray-50 rounded px-1 -mx-1"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No highlights generated.</p>
                )}
              </div>
            </div>

            {/* Sidebar: confidence + flags */}
            <div className="space-y-4">
              {Object.keys(confidence).length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                    <Sparkles className="h-4 w-4 text-groupon-green" />
                    AI Confidence
                  </h4>
                  <div className="space-y-2.5">
                    {Object.entries(confidence).map(([field, score]) => (
                      <ConfidenceBar key={field} field={field} score={typeof score === 'number' ? score : 0} />
                    ))}
                  </div>
                </div>
              )}
              {flags.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-700">
                    <AlertTriangle className="h-4 w-4" />
                    Review Suggested
                  </div>
                  <ul className="space-y-1 text-sm text-amber-600">
                    {flags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {deal.scheduling_recommendation && (
                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">{deal.scheduling_recommendation}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== PRICING TAB ===== */}
        {activeTab === 'pricing' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-gray-900">Pricing & Options</h3>
              <p className="mt-1 text-sm text-gray-500">
                These are the options customers will see. AI has set recommended pricing based on your market.
              </p>
            </div>
            {services.length > 0 ? (
              <div className="space-y-4">
                {services.map((service, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Option {i + 1}
                        </span>
                        <h4 className="font-heading text-base font-bold text-gray-900 mt-0.5">
                          {service.name}
                        </h4>
                      </div>
                      <Badge className="bg-groupon-green/10 text-groupon-green border-0 font-bold">
                        {service.discount_pct}% Off
                      </Badge>
                    </div>
                    {service.description && (
                      <p className="text-sm text-gray-500 mb-4">{service.description}</p>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <span className="text-xs text-gray-400 block">Regular Price</span>
                        <span className="text-lg font-bold text-gray-400 line-through">
                          ${service.original_price}
                        </span>
                      </div>
                      <div className="rounded-lg bg-groupon-green-light p-3">
                        <span className="text-xs text-groupon-green-dark block">Deal Price</span>
                        <span className="text-lg font-bold text-groupon-green">
                          ${service.deal_price}
                        </span>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <span className="text-xs text-gray-400 block">Monthly Cap</span>
                        <span className="text-lg font-bold text-gray-700">
                          {service.voucher_cap || 50}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
                No pricing options generated. Try starting over with more detail about your services.
              </div>
            )}
          </div>
        )}

        {/* ===== TERMS TAB ===== */}
        {activeTab === 'terms' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-gray-900">Terms & Fine Print</h3>
              <p className="mt-1 text-sm text-gray-500">
                AI has generated standard terms for your deal. Review and adjust as needed.
              </p>
            </div>

            {isStructuredFinePrint && finePrintObj ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FinePrintCard label="Expiry" value={`${finePrintObj.expiry_days} days after purchase`} />
                  <FinePrintCard label="Limit per person" value={`${finePrintObj.max_per_person}`} />
                  <FinePrintCard label="Appointment" value={finePrintObj.appointment_required ? 'Required' : 'Not required'} />
                  <FinePrintCard label="Eligibility" value={finePrintObj.new_customers_only ? 'New customers only' : 'All customers'} />
                </div>

                {finePrintObj.restrictions && finePrintObj.restrictions.length > 0 && (
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Restrictions</h4>
                    <div className="flex flex-wrap gap-2">
                      {finePrintObj.restrictions.map((r, i) => (
                        <Badge key={i} variant="outline" className="text-sm text-gray-600 border-gray-200 px-3 py-1">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {finePrintObj.cancellation_policy && (
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Cancellation Policy</h4>
                    <p className="text-sm text-gray-600">{finePrintObj.cancellation_policy}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <EditableField
                  value={finePrintText || 'No fine print generated.'}
                  editing={editingField === 'fine_print'}
                  onStartEdit={() => startEdit('fine_print', finePrintText)}
                  onSave={() => saveEdit('fine_print')}
                  onCancel={cancelEdit}
                  editValue={editValue}
                  onEditChange={setEditValue}
                  multiline
                  renderDisplay={(value) => (
                    <p className="text-sm leading-relaxed text-gray-600">{value}</p>
                  )}
                />
              </div>
            )}
          </div>
        )}

        {/* ===== REDEMPTION TAB ===== */}
        {activeTab === 'redemption' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-gray-900">Redemption Details</h3>
              <p className="mt-1 text-sm text-gray-500">
                How customers will redeem their voucher.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Redemption Method</label>
                <div className="space-y-2">
                  {['physical_location', 'travel_to_customer', 'online'].map((method) => (
                    <label key={method} className="flex items-center gap-3 rounded-lg border border-gray-100 px-4 py-3 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="redemption_method"
                        checked={(voucher?.redemption_method || 'physical_location') === method}
                        onChange={() =>
                          setDeal({
                            ...deal,
                            voucher_instructions: {
                              ...(voucher || { appointment_required: true, instructions: '' }),
                              redemption_method: method,
                            },
                          })
                        }
                        className="text-groupon-green focus:ring-groupon-green"
                      />
                      <span className="text-sm text-gray-700">
                        {method === 'physical_location' && 'Customers visit my location'}
                        {method === 'travel_to_customer' && 'I travel to the customer'}
                        {method === 'online' && 'Online / remote service'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-gray-900">Appointment Required</span>
                  <p className="text-xs text-gray-500">Customers must book before visiting</p>
                </div>
                <button
                  onClick={() =>
                    setDeal({
                      ...deal,
                      voucher_instructions: {
                        ...(voucher || { redemption_method: 'physical_location', instructions: '' }),
                        appointment_required: !(voucher?.appointment_required ?? true),
                      },
                    })
                  }
                  className={`h-6 w-11 rounded-full transition-colors ${
                    voucher?.appointment_required !== false ? 'bg-groupon-green' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      voucher?.appointment_required !== false ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">
                  Redemption Instructions
                </label>
                <Textarea
                  value={voucher?.instructions || ''}
                  onChange={(e) =>
                    setDeal({
                      ...deal,
                      voucher_instructions: {
                        ...(voucher || { redemption_method: 'physical_location', appointment_required: true }),
                        instructions: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., Present your Groupon voucher at check-in. Please arrive 5 minutes early."
                  className="rounded-lg text-sm min-h-[80px]"
                />
              </div>
            </div>

            {deal.scheduling_recommendation && (
              <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-5 py-3.5">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">{deal.scheduling_recommendation}</span>
              </div>
            )}
          </div>
        )}

        {/* ===== BUSINESS PROFILE TAB ===== */}
        {activeTab === 'business' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-gray-900">Business Profile</h3>
              <p className="mt-1 text-sm text-gray-500">
                This information appears on your deal page and vouchers.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-900 mb-1 block">Business Name</label>
                <Input value={intake.business_name} disabled className="rounded-lg bg-gray-50 text-sm" />
                <p className="text-xs text-gray-400 mt-1">Set during intake</p>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-900 mb-1 block">Phone Number</label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(312) 555-0123"
                  className="rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-900 mb-1 block">Full Business Address</label>
                <Input
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  placeholder="1234 N Milwaukee Ave, Chicago, IL 60622"
                  className="rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-900 mb-1 block">
                  Website <span className="text-xs text-gray-400 font-normal">(optional)</span>
                </label>
                <Input
                  value={contactWebsite}
                  onChange={(e) => setContactWebsite(e.target.value)}
                  placeholder="www.sofiasstudio.com"
                  className="rounded-lg text-sm"
                />
              </div>

              <Separator />

              <div>
                <label className="text-sm font-bold text-gray-900 mb-2 block">Business Type</label>
                <div className="space-y-2">
                  {[
                    { value: 'sole_provider', label: 'Sole provider of services', desc: 'You are the sole provider, working independently' },
                    { value: 'independent_contractor', label: 'Independent contractor', desc: 'Contracting to perform services for another company' },
                    { value: 'company', label: 'Company with employees', desc: 'You have one or more employees performing services' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-start gap-3 rounded-lg border border-gray-100 px-4 py-3 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="business_type"
                        checked={businessType === opt.value}
                        onChange={() => setBusinessType(opt.value)}
                        className="mt-0.5 text-groupon-green focus:ring-groupon-green"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== REVIEW & PUBLISH TAB ===== */}
        {activeTab === 'review' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-gray-900">Review & Publish</h3>
              <p className="mt-1 text-sm text-gray-500">
                Everything looks good? Review below and publish your deal.
              </p>
            </div>

            {/* Completion checklist */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h4 className="font-heading text-sm font-bold text-gray-900 mb-3">Checklist</h4>
              <div className="space-y-2">
                {tabs.filter((t) => t.id !== 'review').map((tab) => (
                  <div key={tab.id} className="flex items-center gap-3 text-sm">
                    {tabComplete[tab.id] ? (
                      <CheckCircle2 className="h-4 w-4 text-groupon-green" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={tabComplete[tab.id] ? 'text-gray-700' : 'text-gray-400'}>
                      {tab.label}
                    </span>
                    {!tabComplete[tab.id] && (
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className="ml-auto text-xs text-groupon-green font-medium hover:underline"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deal summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h4 className="font-heading text-sm font-bold text-gray-900 mb-3">Deal Summary</h4>
              <div className="space-y-3 text-sm">
                <SummaryRow label="Title" value={deal.title || '—'} />
                <SummaryRow label="Category" value={deal.category || '—'} />
                <SummaryRow label="Business" value={intake.business_name} />
                <SummaryRow label="Location" value={contactAddress || intake.location} />
                <SummaryRow label="Phone" value={contactPhone || '—'} />
                <Separator />
                <div>
                  <span className="text-gray-500">Options:</span>
                  {services.map((s, i) => (
                    <div key={i} className="flex justify-between mt-1">
                      <span className="text-gray-700">{s.name}</span>
                      <span className="font-medium">
                        <span className="text-gray-400 line-through mr-2">${s.original_price}</span>
                        <span className="text-groupon-green font-bold">${s.deal_price}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Publish */}
            <Button
              onClick={onPublish}
              className="w-full h-14 rounded-xl bg-groupon-green text-lg font-bold text-white shadow-lg shadow-groupon-green/20 hover:bg-groupon-green-dark"
            >
              Publish Deal
            </Button>
            <p className="text-center text-xs text-gray-400">
              Your deal will be submitted for review and go live within 1 business day.
            </p>
          </div>
        )}
      </div>

      {/* Pipeline details */}
      <div className="mt-8 border-t border-gray-100 pt-5">
        <button
          onClick={() => setShowPipeline(!showPipeline)}
          className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-600"
        >
          {showPipeline ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Pipeline details — {result.total_latency_ms}ms total
        </button>
        {showPipeline && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {Object.entries(result.pipeline_steps).map(([name, step]) => (
              <div key={name} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {name.replace(/_/g, ' ')}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{step.model}</Badge>
                  <span className="text-xs text-gray-400">{step.latency_ms}ms</span>
                </div>
                <pre className="mt-3 max-h-36 overflow-auto rounded-lg bg-white p-3 text-xs text-gray-500 border border-gray-100">
                  {JSON.stringify(step.output, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Helpers ---

function normalizeDeal(raw: GeneratedDeal): GeneratedDeal {
  return {
    title: raw?.title || 'Deal Title',
    description: raw?.description || '',
    highlights: Array.isArray(raw?.highlights) ? raw.highlights : [],
    services: Array.isArray(raw?.services) ? raw.services : [],
    fine_print: raw?.fine_print || '',
    voucher_instructions: raw?.voucher_instructions || { redemption_method: 'physical_location', appointment_required: true, instructions: '' },
    category: raw?.category || 'Uncategorized',
    scheduling_recommendation: raw?.scheduling_recommendation || '',
    photo_guidance: raw?.photo_guidance || '',
    confidence: raw?.confidence || {},
    flags: Array.isArray(raw?.flags) ? raw.flags : [],
  };
}

function formatStructuredFinePrint(fp: FinePrint): string {
  const parts: string[] = [];
  if (fp.new_customers_only) parts.push('New customers only.');
  parts.push(`Expires ${fp.expiry_days} days after purchase.`);
  parts.push(`Limit ${fp.max_per_person} per person.`);
  if (fp.appointment_required) parts.push('Appointment required.');
  if (fp.restrictions) parts.push(...fp.restrictions.map((r) => `${r}.`));
  if (fp.cancellation_policy) parts.push(fp.cancellation_policy);
  return parts.join(' ');
}

function FinePrintCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <span className="text-xs text-gray-400 block">{label}</span>
      <span className="text-base font-semibold text-gray-900 mt-0.5 block">{value}</span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}

// --- Editable Field ---

interface EditableFieldProps {
  value: string;
  editing: boolean;
  confidence?: number;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  editValue: string;
  onEditChange: (v: string) => void;
  multiline?: boolean;
  renderDisplay: (value: string) => React.ReactNode;
}

function EditableField({ value, editing, confidence, onStartEdit, onSave, onCancel, editValue, onEditChange, multiline, renderDisplay }: EditableFieldProps) {
  if (editing) {
    return (
      <div className="space-y-2">
        {multiline ? (
          <Textarea autoFocus value={editValue} onChange={(e) => onEditChange(e.target.value)} className="rounded-xl text-base" />
        ) : (
          <Input autoFocus value={editValue} onChange={(e) => onEditChange(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel(); }} className="rounded-xl text-base" />
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={onSave} className="rounded-lg bg-groupon-green text-white hover:bg-groupon-green-dark"><Check className="mr-1 h-3 w-3" /> Save</Button>
          <Button size="sm" variant="ghost" onClick={onCancel}><X className="mr-1 h-3 w-3" /> Cancel</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="group relative cursor-pointer rounded-xl px-3 py-2 transition-all hover:bg-groupon-green/[0.04] hover:ring-1 hover:ring-groupon-green/20" onClick={onStartEdit}>
      {renderDisplay(value)}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-white p-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <Edit3 className="h-3.5 w-3.5 text-gray-400" />
      </div>
      {confidence !== undefined && confidence < 0.8 && (
        <Badge variant="outline" className="mt-2 border-amber-300 text-amber-600 text-xs">
          <Sparkles className="mr-1 h-3 w-3" /> AI suggestion — review recommended
        </Badge>
      )}
    </div>
  );
}

function ConfidenceBar({ field, score }: { field: string; score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 85 ? 'bg-groupon-green' : pct >= 70 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs capitalize text-gray-500">{field}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-medium text-gray-400">{pct}%</span>
    </div>
  );
}
