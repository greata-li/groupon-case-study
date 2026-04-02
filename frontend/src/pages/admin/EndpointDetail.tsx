import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchEndpoint,
  updateEndpoint,
  testEndpoint,
  type EndpointConfig,
  type TestResult,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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

const AVAILABLE_MODELS = [
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (fast, cheap)' },
  { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4 (balanced)' },
  { id: 'claude-opus-4-6', label: 'Claude Opus 4.6 (most capable)' },
];
import {
  ArrowLeft,
  Save,
  Play,
  Loader2,
  Clock,
  Cpu,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export function EndpointDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [config, setConfig] = useState<EndpointConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [systemPrompt, setSystemPrompt] = useState('');
  const [model, setModel] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [maxTokens, setMaxTokens] = useState(0);

  // Test panel
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchEndpoint(id)
      .then((cfg) => {
        setConfig(cfg);
        setSystemPrompt(cfg.system_prompt);
        setModel(cfg.model);
        setTemperature(cfg.temperature);
        setMaxTokens(cfg.max_tokens);
        setTestInput(JSON.stringify(cfg.sample_input, null, 2));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    if (!id) return;
    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateEndpoint(id, {
        system_prompt: systemPrompt,
        model,
        temperature,
        max_tokens: maxTokens,
      });
      setConfig(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    if (!id) return;
    setTesting(true);
    setTestResult(null);
    setTestError(null);
    try {
      const input = JSON.parse(testInput);
      const result = await testEndpoint(id, input);
      setTestResult(result);
    } catch (e) {
      setTestError(e instanceof Error ? e.message : 'Test failed');
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{config.name}</h2>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Saved
            </Badge>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="prompt">
        <TabsList>
          <TabsTrigger value="prompt">Prompt & Config</TabsTrigger>
          <TabsTrigger value="test">Test Panel</TabsTrigger>
        </TabsList>

        {/* Prompt & Config Tab */}
        <TabsContent value="prompt" className="space-y-6">
          {/* Model settings row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input
                type="number"
                min={0}
                max={2}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Tokens</Label>
              <Input
                type="number"
                min={1}
                max={8192}
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* System prompt */}
          <div className="space-y-2">
            <Label>System Prompt</Label>
            <Textarea
              className="min-h-[400px] font-mono text-sm"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>
        </TabsContent>

        {/* Test Panel Tab */}
        <TabsContent value="test" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Test Input (JSON)</Label>
                <Button onClick={handleTest} disabled={testing} size="sm">
                  {testing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  Run Test
                </Button>
              </div>
              <Textarea
                className="min-h-[350px] font-mono text-sm"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
              />
            </div>

            {/* Output */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Output</Label>
              {testing && (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Running {config.name}...
                    </div>
                  </CardContent>
                </Card>
              )}
              {testError && (
                <Card className="border-destructive/50">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {testError}
                    </div>
                  </CardContent>
                </Card>
              )}
              {testResult && !testing && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Cpu className="h-3 w-3" />
                        {testResult.model}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {testResult.latency_ms}ms
                      </Badge>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4">
                    <pre className="max-h-[300px] overflow-auto rounded-md bg-muted p-4 text-sm">
                      {JSON.stringify(testResult.output, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
              {!testing && !testResult && !testError && (
                <Card>
                  <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
                    Click "Run Test" to see output
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
