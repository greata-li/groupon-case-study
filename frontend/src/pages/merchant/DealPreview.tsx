import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GeneratedDeal, PipelineResult, MerchantIntake } from '@/lib/api';
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
} from 'lucide-react';

interface DealPreviewProps {
  result: PipelineResult;
  intake: MerchantIntake;
  onPublish: () => void;
}

export function DealPreview({ result, intake, onPublish }: DealPreviewProps) {
  const navigate = useNavigate();
  const [deal, setDeal] = useState<GeneratedDeal>(result.deal);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showPipeline, setShowPipeline] = useState(false);

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

  return (
    <div className="animate-fade-in-up mx-auto max-w-6xl px-6 py-8">
      {/* Editor banner */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-groupon-green/20 bg-groupon-green-light/30 px-5 py-3">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 text-groupon-green" />
          <div>
            <span className="text-sm font-semibold text-gray-900">Deal Preview</span>
            <span className="ml-2 text-sm text-gray-500">&mdash; Click any field to edit</span>
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
      <div className="grid grid-cols-[1fr_380px] gap-8">
        {/* Left column — Deal content */}
        <div className="space-y-5">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-400">
            Home &rsaquo; {deal.category?.replace(' > ', ' \u203A ') ?? 'Beauty & Spas'}
          </div>

          {/* Title */}
          <EditableField
            value={deal.title}
            editing={editingField === 'title'}
            confidence={deal.confidence?.title}
            onStartEdit={() => startEdit('title', deal.title)}
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
            <div className="flex h-80 flex-col items-center justify-center gap-3">
              <div className="rounded-2xl bg-white p-5 shadow-lg shadow-gray-900/5">
                <Camera className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">{deal.photo_guidance}</p>
              <p className="text-xs text-gray-400">Photos will be added before publishing</p>
            </div>
            {/* Groupon-style action icons */}
            <div className="absolute right-4 top-4 flex gap-2">
              <div className="rounded-full bg-white/90 p-2 shadow-sm">
                <Share2 className="h-4 w-4 text-gray-500" />
              </div>
              <div className="rounded-full bg-white/90 p-2 shadow-sm">
                <Heart className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Tabs — About / Fine Print */}
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
                value={deal.description}
                editing={editingField === 'description'}
                confidence={deal.confidence?.description}
                onStartEdit={() => startEdit('description', deal.description)}
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

          {/* Fine Print */}
          <div className="rounded-xl bg-gray-50 p-5">
            <h3 className="font-heading text-base font-bold text-gray-900">Fine Print</h3>
            <div className="mt-2">
              <EditableField
                value={deal.fine_print}
                editing={editingField === 'fine_print'}
                onStartEdit={() => startEdit('fine_print', deal.fine_print)}
                onSave={() => saveEdit('fine_print')}
                onCancel={cancelEdit}
                editValue={editValue}
                onEditChange={setEditValue}
                multiline
                renderDisplay={(value) => (
                  <p className="text-sm leading-relaxed text-gray-500">{value}</p>
                )}
              />
            </div>
          </div>

          {/* Scheduling */}
          {deal.scheduling_recommendation && (
            <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-5 py-3.5">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">
                {deal.scheduling_recommendation}
              </span>
            </div>
          )}
        </div>

        {/* Right column — Pricing sidebar */}
        <div className="space-y-4">
          {/* Pricing card */}
          <div className="sticky top-4 space-y-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-900/[0.04]">
              <div className="border-b border-gray-100 px-5 py-4">
                <h3 className="font-heading font-bold text-gray-900">Select Option:</h3>
              </div>

              <div className="p-4 space-y-3">
                {deal.services.map((service, i) => (
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
                ))}
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
            {deal.confidence && (
              <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Sparkles className="h-4 w-4 text-groupon-green" />
                  AI Confidence
                </h4>
                <div className="space-y-2.5">
                  {Object.entries(deal.confidence).map(([field, score]) => (
                    <ConfidenceBar key={field} field={field} score={score as number} />
                  ))}
                </div>
              </div>
            )}

            {/* Flags */}
            {deal.flags && deal.flags.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                  Review Suggested
                </div>
                <ul className="space-y-1 text-sm text-amber-600">
                  {deal.flags.map((flag, i) => (
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
          {showPipeline ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Pipeline details &mdash; {result.total_latency_ms}ms total
        </button>
        {showPipeline && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {Object.entries(result.pipeline_steps).map(([name, step]) => (
              <div key={name} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {name.replace('_', ' ')}
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
          <Sparkles className="mr-1 h-3 w-3" /> AI suggestion &mdash; review recommended
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
