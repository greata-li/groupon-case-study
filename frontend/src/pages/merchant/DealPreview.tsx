import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GeneratedDeal, PipelineResult, MerchantIntake } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

  function updateServicePrice(index: number, newPrice: number) {
    const updated = [...deal.services];
    updated[index] = { ...updated[index], deal_price: newPrice };
    setDeal({ ...deal, services: updated });
  }

  const maxDiscount = Math.max(...deal.services.map((s) => s.discount_pct));

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 text-gray-400" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Deal Preview</h2>
            <p className="text-sm text-gray-500">
              This is how customers will see your deal. Click any field to edit.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/create')}>
            Start Over
          </Button>
          <Button
            onClick={onPublish}
            className="h-11 bg-[#53A318] px-8 font-semibold text-white hover:bg-[#478f15]"
          >
            Publish Deal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column: Deal display (Groupon-style) */}
        <div className="col-span-2 space-y-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-400">
            {deal.category}
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
              <h1 className="text-2xl font-bold text-gray-900">{value}</h1>
            )}
          />

          {/* Business info bar */}
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium text-[#53A318]">{intake.business_name}</span>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4" />
              <span className="ml-1 text-gray-500">New Business</span>
            </div>
          </div>

          {/* Image placeholder */}
          <Card className="overflow-hidden border-dashed border-gray-300 bg-gray-50">
            <CardContent className="flex h-64 flex-col items-center justify-center gap-3 text-gray-400">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <Sparkles className="h-8 w-8 text-[#53A318]" />
              </div>
              <p className="text-sm font-medium">{deal.photo_guidance}</p>
              <p className="text-xs">Photos will be added before publishing</p>
            </CardContent>
          </Card>

          {/* Description */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">About This Deal</h3>
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
                <p className="text-gray-600 leading-relaxed">{value}</p>
              )}
            />
          </div>

          {/* Fine Print */}
          <div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Fine Print</h3>
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
                <p className="text-sm text-gray-500">{value}</p>
              )}
            />
          </div>

          {/* Scheduling */}
          {deal.scheduling_recommendation && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <Clock className="h-4 w-4" />
              {deal.scheduling_recommendation}
            </div>
          )}
        </div>

        {/* Right column: Pricing sidebar (Groupon-style) */}
        <div className="space-y-4">
          {/* Pricing card */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold">Select Option:</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {deal.services.map((service, i) => (
                <div
                  key={i}
                  className="rounded-lg border-2 border-[#53A318]/20 bg-[#53A318]/5 p-4"
                >
                  <div className="mb-1 font-medium text-gray-900">{service.name}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-400 line-through">
                      ${service.original_price}
                    </span>
                    <span className="text-2xl font-bold text-[#53A318]">
                      ${service.deal_price}
                    </span>
                    <Badge className="bg-[#53A318] text-white">
                      -{service.discount_pct}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
            <Separator />
            <CardContent className="pt-4">
              <Button
                onClick={onPublish}
                className="w-full h-12 bg-[#53A318] text-base font-semibold text-white hover:bg-[#478f15]"
              >
                Publish Deal
              </Button>
              <p className="mt-2 text-center text-xs text-gray-400">
                You review everything before it goes live
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardContent className="flex items-center gap-3 py-4">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">{intake.location}</span>
            </CardContent>
          </Card>

          {/* Confidence indicators */}
          {deal.confidence && (
            <Card>
              <CardContent className="py-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-900">AI Confidence</h4>
                <div className="space-y-2">
                  {Object.entries(deal.confidence).map(([field, score]) => (
                    <ConfidenceBar key={field} field={field} score={score as number} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flags */}
          {deal.flags && deal.flags.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="py-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                  Review Suggested
                </div>
                <ul className="space-y-1 text-sm text-amber-600">
                  {deal.flags.map((flag, i) => (
                    <li key={i}>- {flag}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Pipeline details (collapsible) */}
      <div className="mt-8">
        <button
          onClick={() => setShowPipeline(!showPipeline)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600"
        >
          {showPipeline ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Pipeline details ({result.total_latency_ms}ms total)
        </button>
        {showPipeline && (
          <div className="mt-3 grid grid-cols-3 gap-4">
            {Object.entries(result.pipeline_steps).map(([name, step]) => (
              <Card key={name} className="bg-gray-50">
                <CardContent className="py-3">
                  <div className="mb-1 text-xs font-medium text-gray-500">{name}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{step.model}</Badge>
                    <span className="text-xs text-gray-400">{step.latency_ms}ms</span>
                  </div>
                  <pre className="mt-2 max-h-32 overflow-auto text-xs text-gray-500">
                    {JSON.stringify(step.output, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Editable Field Component ---

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
            className="text-base"
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
            className="text-base"
          />
        )}
        <div className="flex gap-2">
          <Button size="sm" onClick={onSave} className="bg-[#53A318] text-white hover:bg-[#478f15]">
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
      className="group relative cursor-pointer rounded-lg px-2 py-1 transition-colors hover:bg-gray-100"
      onClick={onStartEdit}
    >
      {renderDisplay(value)}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <Edit3 className="h-4 w-4 text-gray-400" />
      </div>
      {confidence !== undefined && confidence < 0.8 && (
        <Badge variant="outline" className="ml-2 border-amber-300 text-amber-600 text-xs">
          <Sparkles className="mr-1 h-3 w-3" /> AI suggestion — review
        </Badge>
      )}
    </div>
  );
}

// --- Confidence Bar ---

function ConfidenceBar({ field, score }: { field: string; score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 85 ? 'bg-[#53A318]' : pct >= 70 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs capitalize text-gray-500">{field}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-xs text-gray-400">{pct}%</span>
    </div>
  );
}
