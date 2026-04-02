import { useEffect, useState } from 'react';
import {
  fetchBenchmarks,
  updateBenchmarks,
  type BenchmarkData,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  Info,
  Database,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export function BenchmarkEditor() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [rawJson, setRawJson] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [showRawJson, setShowRawJson] = useState(false);

  useEffect(() => {
    fetchBenchmarks()
      .then((d) => {
        setData(d);
        setRawJson(JSON.stringify(d, null, 2));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function handleJsonChange(value: string) {
    setRawJson(value);
    setParseError(null);
    try {
      JSON.parse(value);
    } catch {
      setParseError('Invalid JSON');
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const parsed = JSON.parse(rawJson);
      const updated = await updateBenchmarks(parsed);
      setData(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        Loading benchmark data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight">Benchmark Data</h2>
          <p className="mt-1 text-sm text-gray-500">
            Market intelligence data used by the pipeline to recommend pricing and deal structure.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Saved
            </Badge>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !!parseError}
            className="rounded-lg bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Dismissable context */}
      {showGuide && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
          <div className="flex-1 text-sm text-blue-700">
            <p className="font-medium">What is this data?</p>
            <p className="mt-1 text-blue-600">
              Synthetic market data simulating Groupon's deal performance database.
              The Market Intelligence endpoint reads this at runtime to recommend pricing.
              In production, this pulls from real metrics.
            </p>
          </div>
          <button
            onClick={() => setShowGuide(false)}
            className="shrink-0 rounded-md p-1 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Meta badges */}
      {data?._meta && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1.5 text-xs">
            <Database className="h-3 w-3" />
            {data._meta.data_source}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Coverage: {data._meta.coverage}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Updated: {data._meta.last_updated}
          </Badge>
        </div>
      )}

      {/* Assumptions table */}
      {data?.assumptions && (
        <Card className="border-gray-100">
          <CardHeader className="border-b pb-3">
            <CardTitle className="flex items-center gap-2 font-heading text-base">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Stated Assumptions
            </CardTitle>
            <p className="text-xs text-gray-500">
              Every assumption is explicitly documented. If wrong, the impact and validation plan are noted.
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">#</TableHead>
                  <TableHead>Assumption</TableHead>
                  <TableHead>Basis</TableHead>
                  <TableHead>If Wrong</TableHead>
                  <TableHead>How to Validate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.assumptions.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs text-gray-400">
                      {a.id}
                    </TableCell>
                    <TableCell className="text-sm font-medium">{a.assumption}</TableCell>
                    <TableCell className="text-sm text-gray-500">{a.basis}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {a.impact_if_wrong}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{a.validation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Raw JSON editor - collapsible */}
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRawJson((prev) => !prev)}
          className="rounded-lg text-xs font-medium"
        >
          {showRawJson ? (
            <ChevronDown className="mr-1.5 h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="mr-1.5 h-3.5 w-3.5" />
          )}
          <FileJson className="mr-1.5 h-3.5 w-3.5 text-gray-500" />
          {showRawJson ? 'Hide Raw JSON Editor' : 'Show Raw JSON Editor'}
        </Button>

        {showRawJson && (
          <Card className="border-gray-100 mt-3">
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <FileJson className="h-4 w-4 text-gray-500" />
                Raw Data Editor
              </CardTitle>
              <p className="text-xs text-gray-500">
                Edit the benchmark data directly. Changes affect how the Market Intelligence
                endpoint recommends pricing. The pipeline reads this data at runtime.
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              {parseError && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  {parseError}
                </div>
              )}
              {error && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Textarea
                className="min-h-[400px] rounded-lg font-mono text-xs leading-relaxed"
                value={rawJson}
                onChange={(e) => handleJsonChange(e.target.value)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
