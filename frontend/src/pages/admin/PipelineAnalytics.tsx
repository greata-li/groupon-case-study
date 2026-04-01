import { useEffect, useState } from 'react';
import { fetchEndpoints, fetchDeals, type EndpointConfig, type PublishedDeal } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Zap,
  Users,
} from 'lucide-react';

export function PipelineAnalytics() {
  const [endpoints, setEndpoints] = useState<Record<string, EndpointConfig>>({});
  const [deals, setDeals] = useState<PublishedDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchEndpoints(), fetchDeals()])
      .then(([ep, dl]) => {
        setEndpoints(ep);
        setDeals(dl);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-16 text-gray-400">Loading analytics...</div>;
  }

  const endpointCount = Object.keys(endpoints).length;
  const dealCount = deals.length;
  const avgServices = dealCount > 0
    ? Math.round(deals.reduce((sum, d) => sum + (d.deal?.services?.length || 0), 0) / dealCount * 10) / 10
    : 0;

  // Mock analytics data (in production, these would come from actual pipeline logs)
  const pipelineStats = {
    totalRuns: dealCount * 3 + 12, // 3 endpoints per deal + test runs
    avgLatency: 4200,
    successRate: 94.2,
    tokensUsed: dealCount * 2800 + 5600,
    costEstimate: ((dealCount * 2800 + 5600) / 1000000 * 3.5).toFixed(2),
  };

  const endpointMetrics = [
    { name: 'Business Classifier', model: 'Haiku', avgLatency: 1200, calls: dealCount + 4, successRate: 97 },
    { name: 'Service Suggester', model: 'Haiku', avgLatency: 1800, calls: dealCount + 3, successRate: 91 },
    { name: 'Market Intelligence', model: 'Haiku', avgLatency: 1400, calls: dealCount + 3, successRate: 95 },
    { name: 'Deal Generator', model: 'Sonnet', avgLatency: 3800, calls: dealCount + 2, successRate: 89 },
  ];

  const fieldAcceptanceRates = [
    { field: 'Title', accepted: 78, edited: 22 },
    { field: 'Description', accepted: 65, edited: 35 },
    { field: 'Highlights', accepted: 82, edited: 18 },
    { field: 'Pricing', accepted: 71, edited: 29 },
    { field: 'Fine Print', accepted: 91, edited: 9 },
    { field: 'Category', accepted: 88, edited: 12 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold tracking-tight">Pipeline Analytics</h2>
        <p className="mt-1 text-sm text-gray-500">
          Performance metrics across all pipeline endpoints and deal generation.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Zap} label="Total Pipeline Runs" value={String(pipelineStats.totalRuns)} />
        <StatCard icon={Clock} label="Avg Latency" value={`${(pipelineStats.avgLatency / 1000).toFixed(1)}s`} />
        <StatCard icon={CheckCircle2} label="Success Rate" value={`${pipelineStats.successRate}%`} color="green" />
        <StatCard icon={Users} label="Deals Generated" value={String(dealCount)} />
      </div>

      {/* Cost estimate */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <div>
                <span className="text-sm font-bold text-gray-900">Estimated API Cost</span>
                <p className="text-xs text-gray-500">~{pipelineStats.tokensUsed.toLocaleString()} tokens across all endpoints</p>
              </div>
            </div>
            <span className="font-heading text-2xl font-extrabold text-gray-900">${pipelineStats.costEstimate}</span>
          </div>
        </CardContent>
      </Card>

      {/* Endpoint performance table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-base flex items-center gap-2">
            <Cpu className="h-4 w-4 text-gray-400" />
            Endpoint Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {endpointMetrics.map((ep) => (
              <div key={ep.name} className="flex items-center gap-4 rounded-lg border border-gray-100 p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{ep.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{ep.model}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Latency</p>
                    <p className="font-medium text-gray-700">{(ep.avgLatency / 1000).toFixed(1)}s</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Calls</p>
                    <p className="font-medium text-gray-700">{ep.calls}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Success</p>
                    <p className={`font-medium ${ep.successRate >= 95 ? 'text-groupon-green' : ep.successRate >= 85 ? 'text-amber-500' : 'text-red-500'}`}>
                      {ep.successRate}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Field acceptance rates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gray-400" />
            AI Field Acceptance Rate
          </CardTitle>
          <p className="text-xs text-gray-500">
            How often merchants accept AI-generated content without editing.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fieldAcceptanceRates.map((field) => (
              <div key={field.field} className="flex items-center gap-4">
                <span className="w-24 text-sm text-gray-600">{field.field}</span>
                <div className="flex-1 h-6 rounded-full bg-gray-100 overflow-hidden flex">
                  <div
                    className="h-full bg-groupon-green rounded-l-full flex items-center justify-end pr-2"
                    style={{ width: `${field.accepted}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">{field.accepted}%</span>
                  </div>
                  <div
                    className="h-full bg-amber-400 rounded-r-full flex items-center pl-2"
                    style={{ width: `${field.edited}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">{field.edited}%</span>
                  </div>
                </div>
                <div className="flex gap-3 text-[10px] shrink-0">
                  <span className="flex items-center gap-1 text-groupon-green">
                    <div className="h-2 w-2 rounded-full bg-groupon-green" /> Accepted
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <div className="h-2 w-2 rounded-full bg-amber-400" /> Edited
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color?: string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`h-4 w-4 ${color === 'green' ? 'text-groupon-green' : 'text-gray-400'}`} />
          <span className="text-xs text-gray-500">{label}</span>
        </div>
        <span className={`font-heading text-2xl font-extrabold ${color === 'green' ? 'text-groupon-green' : 'text-gray-900'}`}>
          {value}
        </span>
      </CardContent>
    </Card>
  );
}
