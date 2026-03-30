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
} from 'lucide-react';

interface DealPreviewProps {
  result: PipelineResult;
  intake: MerchantIntake;
  onPublish: () => void;
}

export function DealPreview({ result, intake, onPublish }: DealPreviewProps) {
  const navigate = useNavigate();
  // Normalize the deal — fill missing fields with sensible defaults so the page never crashes
  const [deal, setDeal] = useState<GeneratedDeal>(() => normalizeDeal(result.deal));
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showPipeline, setShowPipeline] = useState(false);

  // Contact details
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState(intake.location);
  const [contactWebsite, setContactWebsite] = useState('');

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

  // Fine print handling
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

  return (
    <div className="animate-fade-in-up mx-auto max-w-6xl px-6 py-8">
      {/* Editor banner */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-groupon-green/20 bg-groupon-green-light/30 px-5 py-3">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 text-groupon-green" />
          <div>
            <span className="text-sm font-semibold text-gray-900">Deal Preview</span>
            <span className="ml-2 text-sm text-gray-500">— Click any field to edit</span>
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

      {/* Groupon deal page layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column — Deal content */}
        <div className="space-y-5">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-400">
            Home &rsaquo; {(deal.category || 'Beauty & Spas').replace(' > ', ' \u203A ')}
          </div>

          {/* Title */}
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
              <h1 className="font-heading text-[1.65rem] font-bold leading-snug text-gray-900">
                {value}
              </h1>
            )}
          />

          {/* Business info */}
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-groupon-green hover:underline cursor-pointer">
              {intake.business_name}
            </span>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <Star className="h-4 w-4 text-gray-300" />
            </div>
            <span className="text-gray-400">New Business</span>
          </div>

          {/* Image placeholder */}
          <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50">
            <div className="flex h-72 flex-col items-center justify-center gap-3">
              <div className="rounded-2xl bg-white p-5 shadow-lg shadow-gray-900/5">
                <Camera className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {deal.photo_guidance || 'Upload a photo of your business to increase conversions'}
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

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h3 className="font-heading text-base font-bold text-gray-900 mb-3">Highlights</h3>
              <ul className="space-y-2">
                {highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px] text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-groupon-green" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-6 text-sm font-medium">
              <span className="border-b-2 border-groupon-green py-3 text-groupon-green">About</span>
              <span className="border-b-2 border-transparent py-3 text-gray-400">Need To Know</span>
              <span className="border-b-2 border-transparent py-3 text-gray-400">FAQs</span>
              <span className="border-b-2 border-transparent py-3 text-gray-400">Reviews</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-heading text-lg font-bold text-gray-900">About This Deal</h3>
            <div className="mt-3">
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

          {/* Per-option details */}
          {services.length > 0 && services.some((s) => s.description) && (
            <div>
              <h3 className="font-heading text-base font-bold text-gray-900 mb-3">
                What's Included
              </h3>
              <div className="space-y-3">
                {services.map(
                  (service, i) =>
                    service.description && (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-100 bg-gray-50/50 p-4"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900 text-sm">
                            {service.name}
                          </span>
                          <span className="text-sm font-bold text-groupon-green">
                            ${service.deal_price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{service.description}</p>
                        {service.voucher_cap && (
                          <span className="mt-2 inline-block text-xs text-gray-400">
                            Monthly cap: {service.voucher_cap} vouchers
                          </span>
                        )}
                      </div>
                    ),
                )}
              </div>
            </div>
          )}

          {/* Fine Print */}
          <div className="rounded-xl bg-gray-50 p-5">
            <h3 className="font-heading text-base font-bold text-gray-900 mb-3">Fine Print</h3>

            {isStructuredFinePrint && finePrintObj ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FinePrintItem
                    label="Expires"
                    value={`${finePrintObj.expiry_days} days after purchase`}
                  />
                  <FinePrintItem
                    label="Limit"
                    value={`${finePrintObj.max_per_person} per person`}
                  />
                  <FinePrintItem
                    label="Appointment"
                    value={
                      finePrintObj.appointment_required ? 'Required' : 'Not required'
                    }
                  />
                  <FinePrintItem
                    label="Eligibility"
                    value={
                      finePrintObj.new_customers_only
                        ? 'New customers only'
                        : 'All customers'
                    }
                  />
                </div>
                {finePrintObj.restrictions && finePrintObj.restrictions.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 mb-1.5 block">
                      Restrictions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {finePrintObj.restrictions.map((r, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs text-gray-500 border-gray-200"
                        >
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {finePrintObj.cancellation_policy && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Cancellation:</span>{' '}
                    {finePrintObj.cancellation_policy}
                  </p>
                )}
              </div>
            ) : (
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
                  <p className="text-sm leading-relaxed text-gray-500">{value}</p>
                )}
              />
            )}
          </div>

          {/* Voucher Instructions */}
          {voucher && (
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h3 className="font-heading text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Ticket className="h-4 w-4 text-gray-400" />
                How to Redeem
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-gray-400" />
                  {voucher.redemption_method === 'physical_location'
                    ? 'Visit the business location'
                    : voucher.redemption_method === 'online'
                      ? 'Redeem online'
                      : 'Provider will travel to you'}
                </div>
                {voucher.appointment_required && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    Appointment required
                  </div>
                )}
                {voucher.instructions && (
                  <p className="text-gray-500 mt-2">{voucher.instructions}</p>
                )}
              </div>
            </div>
          )}

          {/* Scheduling */}
          {deal.scheduling_recommendation && (
            <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-5 py-3.5">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">
                {deal.scheduling_recommendation}
              </span>
            </div>
          )}

          {/* Complete Before Publishing */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
            <h3 className="font-heading text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              Complete Before Publishing
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              These details are needed for your live deal listing.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  Phone Number
                </label>
                <Input
                  placeholder="e.g., (312) 555-0123"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  Full Business Address
                </label>
                <Input
                  placeholder="e.g., 1234 N Milwaukee Ave, Chicago, IL 60622"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  className="rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                  Business Website
                  <span className="text-xs text-gray-400 font-normal">(optional)</span>
                </label>
                <Input
                  placeholder="e.g., www.sofiasstudio.com"
                  value={contactWebsite}
                  onChange={(e) => setContactWebsite(e.target.value)}
                  className="rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column — Pricing sidebar */}
        <div className="space-y-4">
          <div className="sticky top-4 space-y-4">
            {/* Pricing card */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-900/[0.04]">
              <div className="border-b border-gray-100 px-5 py-4">
                <h3 className="font-heading font-bold text-gray-900">Select Option:</h3>
              </div>

              <div className="p-4 space-y-3">
                {services.length > 0 ? (
                  services.map((service, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border-2 p-4 transition-all ${
                        i === 0
                          ? 'border-groupon-green bg-groupon-green-light/30'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-5 w-5 rounded-full border-2 ${
                              i === 0
                                ? 'border-groupon-green bg-groupon-green'
                                : 'border-gray-300'
                            }`}
                          >
                            {i === 0 && (
                              <div className="flex h-full items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-gray-900">{service.name}</span>
                        </div>
                      </div>
                      <div className="mt-3 ml-8">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-gray-400 line-through">
                            ${service.original_price}
                          </span>
                          <span className="font-heading text-2xl font-extrabold text-groupon-green">
                            ${service.deal_price}
                          </span>
                        </div>
                        <Badge className="mt-1.5 bg-groupon-green/10 text-groupon-green border-0 font-bold">
                          {service.discount_pct}% Off
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 py-4 text-center">
                    No service options generated. Try starting over with more detail.
                  </p>
                )}
              </div>

              <Separator />

              <div className="p-4 space-y-3">
                <Button
                  onClick={onPublish}
                  className="w-full h-12 rounded-xl bg-groupon-green text-base font-bold text-white shadow-md shadow-groupon-green/20 hover:bg-groupon-green-dark"
                >
                  Publish Deal
                </Button>
                <p className="text-center text-xs text-gray-400">
                  You review everything before it goes live
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">{intake.location}</span>
            </div>

            {/* Confidence */}
            {Object.keys(confidence).length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Sparkles className="h-4 w-4 text-groupon-green" />
                  AI Confidence
                </h4>
                <div className="space-y-2.5">
                  {Object.entries(confidence).map(([field, score]) => (
                    <ConfidenceBar
                      key={field}
                      field={field}
                      score={typeof score === 'number' ? score : 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Flags */}
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
          </div>
        </div>
      </div>

      {/* Pipeline details */}
      <div className="mt-10 border-t border-gray-100 pt-6">
        <button
          onClick={() => setShowPipeline(!showPipeline)}
          className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-600"
        >
          {showPipeline ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          Pipeline details — {result.total_latency_ms}ms total
        </button>
        {showPipeline && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {Object.entries(result.pipeline_steps).map(([name, step]) => (
              <div
                key={name}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
              >
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {name.replace(/_/g, ' ')}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {step.model}
                  </Badge>
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

// --- Normalize deal data so the UI never crashes on missing fields ---

function normalizeDeal(raw: GeneratedDeal): GeneratedDeal {
  return {
    title: raw?.title || 'Deal Title',
    description: raw?.description || '',
    highlights: Array.isArray(raw?.highlights) ? raw.highlights : [],
    services: Array.isArray(raw?.services) ? raw.services : [],
    fine_print: raw?.fine_print || '',
    voucher_instructions: raw?.voucher_instructions || undefined,
    category: raw?.category || 'Uncategorized',
    scheduling_recommendation: raw?.scheduling_recommendation || '',
    photo_guidance: raw?.photo_guidance || '',
    confidence: raw?.confidence || {},
    flags: Array.isArray(raw?.flags) ? raw.flags : [],
  };
}

// --- Helpers ---

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

function FinePrintItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2.5 border border-gray-100">
      <span className="text-xs text-gray-400 block">{label}</span>
      <span className="text-sm font-medium text-gray-700">{value}</span>
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

function EditableField({
  value,
  editing,
  confidence,
  onStartEdit,
  onSave,
  onCancel,
  editValue,
  onEditChange,
  multiline,
  renderDisplay,
}: EditableFieldProps) {
  if (editing) {
    return (
      <div className="space-y-2">
        {multiline ? (
          <Textarea
            autoFocus
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            className="rounded-xl text-base"
          />
        ) : (
          <Input
            autoFocus
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave();
              if (e.key === 'Escape') onCancel();
            }}
            className="rounded-xl text-base"
          />
        )}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onSave}
            className="rounded-lg bg-groupon-green text-white hover:bg-groupon-green-dark"
          >
            <Check className="mr-1 h-3 w-3" /> Save
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            <X className="mr-1 h-3 w-3" /> Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative cursor-pointer rounded-xl px-3 py-2 transition-all hover:bg-groupon-green/[0.04] hover:ring-1 hover:ring-groupon-green/20"
      onClick={onStartEdit}
    >
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
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right text-xs font-medium text-gray-400">{pct}%</span>
    </div>
  );
}
