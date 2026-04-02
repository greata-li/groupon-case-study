import { useEffect, useState } from 'react';
import {
  fetchEndpoints,
  testEndpoint,
  type EndpointConfig,
  type TestResult,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Play, Loader2, Clock, Cpu, AlertCircle, Info, Lightbulb, X } from 'lucide-react';

export function TestPanel() {
  const [endpoints, setEndpoints] = useState<Record<string, EndpointConfig>>({});
  const [selectedId, setSelectedId] = useState<string>('');
  const [testInput, setTestInput] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(true);

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
      <div className="flex items-center justify-center py-12 text-gray-400">
        Loading...
      </div>
    );
  }

  const selectedEndpoint = selectedId ? endpoints[selectedId] : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight">Test Panel</h2>
        <p className="mt-1 text-sm text-gray-500">
          Run any pipeline endpoint with custom input to see its output. Use this to iterate on prompts.
        </p>
      </div>

      {/* Dismissable how-to guide */}
      {showGuide && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-4">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="flex-1 text-sm text-amber-700">
            <p className="font-medium">How to use</p>
            <p className="mt-1 text-amber-600">
              Select an endpoint (each comes with sample input), edit the JSON, then click
              "Run Test." Results stack so you can compare across prompt iterations.
            </p>
          </div>
          <button
            onClick={() => setShowGuide(false)}
            className="shrink-0 rounded-md p-1 text-amber-400 transition-colors hover:bg-amber-100 hover:text-amber-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-heading text-sm font-bold">1. Select Endpoint</Label>
            <Select value={selectedId} onValueChange={handleEndpointChange}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select endpoint" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(endpoints).map((ep) => (
                  <SelectItem key={ep.id} value={ep.id}>
                    {ep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEndpoint && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <Cpu className="mr-1 h-3 w-3" />
                {selectedEndpoint.model}
              </Badge>
              <Badge variant="outline" className="text-xs">
                temp {selectedEndpoint.temperature}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {selectedEndpoint.max_tokens} tokens
              </Badge>
            </div>
          )}

          <div className="space-y-2">
            <Label className="font-heading text-sm font-bold">2. Edit Input (JSON)</Label>
            <Textarea
              className="min-h-[300px] rounded-lg font-mono text-sm"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
            />
          </div>

          <Button
            onClick={handleTest}
            disabled={testing || !selectedId}
            className="w-full rounded-lg bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
          >
            {testing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            3. Run Test
          </Button>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          <Label className="font-heading text-sm font-bold">
            4. Results {results.length > 0 && `(${results.length} runs)`}
          </Label>

          {testing && (
            <Card className="border-groupon-green/20">
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin text-groupon-green" />
                  Running {selectedEndpoint?.name}...
                </div>
              </CardContent>
            </Card>
          )}

          {results.length === 0 && !testing && (
            <Card className="border-dashed border-gray-200">
              <CardContent className="py-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <Play className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">No results yet</p>
                <p className="mt-1 text-xs text-gray-400">
                  Select an endpoint and click "Run Test" to see output here
                </p>
              </CardContent>
            </Card>
          )}

          {results.map((result, i) => (
            <Card key={i} className="border-gray-100">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-sm">
                    {result.endpoint_id.replace(/_/g, ' ')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <Cpu className="h-3 w-3" />
                      {result.model}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {result.latency_ms}ms
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-3">
                <pre className="max-h-[250px] overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                  {JSON.stringify(result.output, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
