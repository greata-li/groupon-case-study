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
import { Play, Loader2, Clock, Cpu, AlertCircle } from 'lucide-react';

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
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Test Panel</h2>
        <p className="text-muted-foreground">
          Run any pipeline endpoint with sample input. Compare outputs across runs.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Endpoint</Label>
            <Select value={selectedId} onValueChange={handleEndpointChange}>
              <SelectTrigger>
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

          {selectedId && endpoints[selectedId] && (
            <div className="flex gap-2">
              <Badge variant="secondary">{endpoints[selectedId].model}</Badge>
              <Badge variant="outline">temp: {endpoints[selectedId].temperature}</Badge>
            </div>
          )}

          <div className="space-y-2">
            <Label>Input JSON</Label>
            <Textarea
              className="min-h-[300px] font-mono text-sm"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
            />
          </div>

          <Button onClick={handleTest} disabled={testing || !selectedId} className="w-full">
            {testing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Run Test
          </Button>

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Results {results.length > 0 && `(${results.length})`}
          </Label>

          {testing && (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Running...
                </div>
              </CardContent>
            </Card>
          )}

          {results.length === 0 && !testing && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No test results yet. Select an endpoint and click "Run Test."
              </CardContent>
            </Card>
          )}

          {results.map((result, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {result.endpoint_id}
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
                <pre className="max-h-[250px] overflow-auto rounded-md bg-muted p-3 text-xs">
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
