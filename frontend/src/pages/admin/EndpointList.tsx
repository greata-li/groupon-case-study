import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEndpoints, type EndpointConfig } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Cpu, Thermometer, Hash, Info, ChevronRight } from 'lucide-react';

const PIPELINE_ORDER = [
  'business_classifier',
  'service_suggester',
  'market_intelligence',
  'deal_generator',
];

export function EndpointList() {
  const [endpoints, setEndpoints] = useState<Record<string, EndpointConfig>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEndpoints()
      .then(setEndpoints)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-[13px] text-[#9ca3af]">
        Loading endpoints...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
        Failed to load endpoints: {error}
      </div>
    );
  }

  const endpointList = Object.values(endpoints).sort((a, b) => {
    const aIdx = PIPELINE_ORDER.indexOf(a.id);
    const bIdx = PIPELINE_ORDER.indexOf(b.id);
    if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
    if (aIdx >= 0) return -1;
    if (bIdx >= 0) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h2 className="font-heading text-xl font-bold tracking-tight text-[#111827]">
          Pipeline Endpoints
        </h2>
        <p className="mt-0.5 text-[13px] text-[#6b7280]">
          {endpointList.length} endpoints in order of execution. Click to edit prompts, models, and parameters.
        </p>
      </div>

      {/* Context */}
      <div className="flex gap-3 rounded-lg border border-[#dbeafe] bg-[#eff6ff] px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#3b82f6]" />
        <p className="text-[13px] leading-relaxed text-[#1e40af]">
          Merchant input flows through these endpoints in sequence. Each has a configurable
          prompt, model, and temperature. Changes take effect immediately — no redeployment needed.
        </p>
      </div>

      {/* Pipeline flow */}
      <div className="space-y-2">
        {endpointList.map((endpoint, index) => (
          <div key={endpoint.id}>
            <button
              onClick={() => navigate(`/admin/endpoint/${endpoint.id}`)}
              className="group flex w-full items-center gap-4 rounded-lg border border-[rgba(0,0,0,0.06)] bg-white px-4 py-3.5 text-left transition-all hover:border-groupon-green/20 hover:bg-[rgba(83,163,24,0.02)]"
            >
              {/* Step number */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-groupon-green/8 font-heading text-[13px] font-bold text-groupon-green">
                {index + 1}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-[14px] font-semibold text-[#111827]">
                    {endpoint.name}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[12px] text-[#9ca3af]">
                  {endpoint.description}
                </p>
              </div>

              {/* Badges — dense row */}
              <div className="hidden shrink-0 items-center gap-1.5 md:flex">
                <Badge variant="secondary" className="gap-1 rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-medium text-[#4b5563]">
                  <Cpu className="h-3 w-3" />
                  {endpoint.model.replace('claude-', '').replace('-20251001', '').replace('-20250514', '')}
                </Badge>
                <Badge variant="secondary" className="gap-1 rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-medium text-[#4b5563]">
                  <Thermometer className="h-3 w-3" />
                  {endpoint.temperature}
                </Badge>
                <Badge variant="secondary" className="gap-1 rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-medium text-[#4b5563]">
                  <Hash className="h-3 w-3" />
                  {endpoint.max_tokens}
                </Badge>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-4 w-4 shrink-0 text-[#d1d5db] transition-colors group-hover:text-groupon-green" />
            </button>

            {/* Flow connector */}
            {index < endpointList.length - 1 && (
              <div className="ml-[27px] h-2 border-l-2 border-dashed border-[rgba(0,0,0,0.06)]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
