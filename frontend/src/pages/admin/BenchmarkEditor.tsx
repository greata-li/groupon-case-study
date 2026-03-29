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
} from 'lucide-react';

export function BenchmarkEditor() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [rawJson, setRawJson] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

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
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Loading benchmark data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Benchmark Data</h2>
          <p className="text-muted-foreground">
            Synthetic market intelligence data. In production, this would pull from Groupon's actual deal performance database.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Saved
            </Badge>
          )}
          <Button onClick={handleSave} disabled={saving || !!parseError}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Assumptions table */}
      {data?.assumptions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Stated Assumptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">#</TableHead>
                  <TableHead>Assumption</TableHead>
                  <TableHead>Basis</TableHead>
                  <TableHead>Impact if Wrong</TableHead>
                  <TableHead>Validation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.assumptions.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-muted-foreground">{a.id}</TableCell>
                    <TableCell className="font-medium">{a.assumption}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.basis}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.impact_if_wrong}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.validation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Meta info */}
      {data?._meta && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{data._meta.data_source}</Badge>
          <Badge variant="outline">Coverage: {data._meta.coverage}</Badge>
          <Badge variant="outline">Updated: {data._meta.last_updated}</Badge>
        </div>
      )}

      {/* Raw JSON editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileJson className="h-4 w-4" />
            Raw Benchmark Data
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {parseError && (
            <div className="mb-3 flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {parseError}
            </div>
          )}
          {error && (
            <div className="mb-3 flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}
          <Textarea
            className="min-h-[500px] font-mono text-sm"
            value={rawJson}
            onChange={(e) => handleJsonChange(e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
