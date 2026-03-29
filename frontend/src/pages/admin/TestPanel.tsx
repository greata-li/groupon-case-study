import { useEffect, useState } from 'react';
import {
  fetchEndpoints,
  testEndpoint,
  type EndpointConfig,
  type TestResult,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Play, Loader2, Clock, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';

export function TestPanel() {
  const [endpoints, setEndpoints] = useState<Record<string, EndpointConfig>>({});
  const [selectedId, setSelectedId] = useState<string>('');
  const [testInput, setTestInput] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEndpoints()
      .then((data) => {
        setEndpoints(data);
        const firstId = Object.keys(data)[0];
        if (firstId) {
          setSelectedId(firstId);
          setTestInput(JSON.stringify(data[firstId].sample_input, null, 2));
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function handleEndpointChange(id: string) {
    setSelectedId(id);
    const ep = endpoints[id];
    if (ep?.sample_input) {
      setTestInput(JSON.stringify(ep.sample_input, null, 2));
    }
  }

  async function handleTest() {
    if (!selectedId) return;
    setTesting(true);
    setError(null);
    try {
      const input = JSON.parse(testInput);
      const result = await testEndpoint(selectedId, input);
      setResults((prev) => [result, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Test failed');
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-[13px] text-[#9ca3af]">
        Loading...
      </div>
    );
  }

  const selectedEndpoint = selectedId ? endpoints[selectedId] : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl font-bold tracking-tight text-[#111827]">
          Test Panel
        </h2>
        <p className="mt-0.5 text-[13px] text-[#6b7280]">
          Run any endpoint with custom input. Each comes pre-loaded with sample data.
          Results stack so you can compare across prompt iterations.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-5">
        {/* Left: Configuration */}
        <div className="space-y-4">
          {/* Endpoint selector */}
          <div className="rounded-lg border border-[rgba(0,0,0,0.06)] bg-white p-4">
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af]">
              Endpoint
            </label>
            <Select value={selectedId} onValueChange={handleEndpointChange}>
              <SelectTrigger className="rounded-md border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] text-[13px]">
                <SelectValue placeholder="Select endpoint" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(endpoints).map((ep) => (
                  <SelectItem key={ep.id} value={ep.id} className="text-[13px]">
                    {ep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedEndpoint && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-medium text-[#4b5563]">
                  <Cpu className="mr-1 h-3 w-3" />
                  {selectedEndpoint.model.replace('claude-', '').replace('-20251001', '').replace('-20250514', '')}
                </Badge>
                <Badge variant="secondary" className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-medium text-[#4b5563]">
                  temp {selectedEndpoint.temperature}
                </Badge>
                <Badge variant="secondary" className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-medium text-[#4b5563]">
                  {selectedEndpoint.max_tokens} tokens
                </Badge>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="rounded-lg border border-[rgba(0,0,0,0.06)] bg-white p-4">
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af]">
              Input JSON
            </label>
            <Textarea
              className="min-h-[280px] rounded-md border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] font-mono text-[12px] leading-relaxed focus:bg-white"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
            />
          </div>

          {/* Run button */}
          <Button
            onClick={handleTest}
            disabled={testing || !selectedId}
            className="w-full rounded-md bg-groupon-green text-[13px] font-semibold text-white hover:bg-groupon-green-dark disabled:opacity-40"
          >
            {testing ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="mr-2 h-3.5 w-3.5" />
            )}
            Run Test
          </Button>

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af]">
              Results
            </span>
            {results.length > 0 && (
              <span className="text-[11px] text-[#d1d5db]">{results.length} runs</span>
            )}
          </div>

          {testing && (
            <div className="flex items-center gap-2 rounded-lg border border-groupon-green/20 bg-groupon-green-light/30 px-4 py-6 text-[13px] text-[#4b5563]">
              <Loader2 className="h-4 w-4 animate-spin text-groupon-green" />
              Running {selectedEndpoint?.name}...
            </div>
          )}

          {results.length === 0 && !testing && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[rgba(0,0,0,0.08)] py-16">
              <Play className="mb-2 h-5 w-5 text-[#d1d5db]" />
              <p className="text-[13px] text-[#9ca3af]">No results yet</p>
              <p className="mt-0.5 text-[11px] text-[#d1d5db]">
                Run a test to see output here
              </p>
            </div>
          )}

          {results.map((result, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-[rgba(0,0,0,0.06)] bg-white">
              {/* Result header */}
              <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.04)] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-groupon-green" />
                  <span className="text-[13px] font-medium text-[#111827]">
                    {result.endpoint_id.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="rounded bg-[#f3f4f6] px-1.5 py-0 text-[10px] font-medium text-[#6b7280]">
                    <Cpu className="mr-0.5 h-2.5 w-2.5" />
                    {result.model.replace('claude-', '').replace('-20251001', '').replace('-20250514', '')}
                  </Badge>
                  <Badge variant="secondary" className="rounded bg-[#f3f4f6] px-1.5 py-0 text-[10px] font-medium text-[#6b7280]">
                    <Clock className="mr-0.5 h-2.5 w-2.5" />
                    {result.latency_ms}ms
                  </Badge>
                </div>
              </div>
              {/* Result body */}
              <pre className="max-h-[240px] overflow-auto px-4 py-3 font-mono text-[11px] leading-relaxed text-[#4b5563]">
                {JSON.stringify(result.output, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
