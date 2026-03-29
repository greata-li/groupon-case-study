import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEndpoints, type EndpointConfig } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cpu, Thermometer, MessageSquare, Info } from 'lucide-react';

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
      <div className="flex items-center justify-center py-12 text-gray-400">
        Loading endpoints...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load endpoints: {error}
      </div>
    );
  }

  // Sort endpoints by pipeline order, then alphabetically for any extras
  const endpointList = Object.values(endpoints).sort((a, b) => {
    const aIdx = PIPELINE_ORDER.indexOf(a.id);
    const bIdx = PIPELINE_ORDER.indexOf(b.id);
    if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
    if (aIdx >= 0) return -1;
    if (bIdx >= 0) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      {/* Context banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">How the pipeline works</p>
          <p className="mt-1 text-blue-600">
            When a merchant creates a deal, their input flows through these endpoints in order.
            Each endpoint has a configurable prompt, model, and parameters. Edit any endpoint to
            change how the AI behaves — no code changes required.
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight">Pipeline Endpoints</h2>
        <p className="mt-1 text-sm text-gray-500">
          {endpointList.length} endpoints. Click any to edit its prompt, model, and parameters.
        </p>
      </div>

      {/* Pipeline flow visualization */}
      <div className="grid gap-3">
        {endpointList.map((endpoint, index) => (
          <Card
            key={endpoint.id}
            className="cursor-pointer border-gray-100 transition-all hover:border-groupon-green/20 hover:shadow-md"
            onClick={() => navigate(`/admin/endpoint/${endpoint.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-groupon-green/10 text-sm font-bold text-groupon-green">
                    {index + 1}
                  </div>
                  <div>
                    <CardTitle className="font-heading text-base">{endpoint.name}</CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      {endpoint.description}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1.5 text-xs">
                  <Cpu className="h-3 w-3" />
                  {endpoint.model}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1.5 text-xs">
                  <Thermometer className="h-3 w-3" />
                  temp {endpoint.temperature}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1.5 text-xs">
                  <MessageSquare className="h-3 w-3" />
                  {endpoint.max_tokens} tokens
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
