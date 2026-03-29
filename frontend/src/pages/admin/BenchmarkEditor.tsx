import { useEffect, useState } from 'react';
import {
  fetchBenchmarks,
  updateBenchmarks,
  type BenchmarkData,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Info,
  Database,
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
      <div className="flex items-center justify-center py-16 text-[13px] text-[#9ca3af]">
        Loading benchmark data...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-[#111827]">
            Benchmark Data
          </h2>
          <p className="mt-0.5 text-[13px] text-[#6b7280]">
            Market intelligence that drives pricing and deal structure recommendations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-[12px] text-groupon-green">
              <CheckCircle2 className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving || !!parseError}
            className="h-8 rounded-md bg-groupon-green px-4 text-[13px] font-semibold text-white hover:bg-groupon-green-dark disabled:opacity-40"
          >
            {saving ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Context */}
      <div className="flex gap-3 rounded-lg border border-[#dbeafe] bg-[#eff6ff] px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#3b82f6]" />
        <div className="text-[13px] leading-relaxed text-[#1e40af]">
          Synthetic data simulating Groupon's deal performance database. The Market Intelligence
          endpoint reads this at runtime to recommend discounts, pricing, and deal structure.
          In production, this would pull from real performance metrics.
        </div>
      </div>

      {/* Meta */}
      {data?._meta && (
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] text-[#4b5563]">
            <Database className="mr-1 h-3 w-3" />
            {data._meta.data_source}
          </Badge>
          <Badge variant="secondary" className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] text-[#4b5563]">
            {data._meta.coverage}
          </Badge>
          <Badge variant="secondary" className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[11px] text-[#4b5563]">
            Updated {data._meta.last_updated}
          </Badge>
        </div>
      )}

      {/* Assumptions */}
      {data?.assumptions && (
        <div className="overflow-hidden rounded-lg border border-[rgba(0,0,0,0.06)] bg-white">
          <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.04)] px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-[#f59e0b]" />
            <span className="font-heading text-[14px] font-semibold text-[#111827]">
              Stated Assumptions
            </span>
            <span className="text-[11px] text-[#9ca3af]">
              — every assumption is documented with impact and validation plan
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-[rgba(0,0,0,0.04)]">
                <TableHead className="w-8 text-[11px]">#</TableHead>
                <TableHead className="text-[11px]">Assumption</TableHead>
                <TableHead className="text-[11px]">Basis</TableHead>
                <TableHead className="text-[11px]">If Wrong</TableHead>
                <TableHead className="text-[11px]">Validation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.assumptions.map((a) => (
                <TableRow key={a.id} className="border-[rgba(0,0,0,0.04)]">
                  <TableCell className="font-mono text-[11px] text-[#9ca3af]">{a.id}</TableCell>
                  <TableCell className="text-[12px] font-medium text-[#111827]">{a.assumption}</TableCell>
                  <TableCell className="text-[11px] text-[#6b7280]">{a.basis}</TableCell>
                  <TableCell className="text-[11px] text-[#6b7280]">{a.impact_if_wrong}</TableCell>
                  <TableCell className="text-[11px] text-[#6b7280]">{a.validation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Raw editor */}
      <div className="overflow-hidden rounded-lg border border-[rgba(0,0,0,0.06)] bg-white">
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.04)] px-4 py-3">
          <span className="font-heading text-[14px] font-semibold text-[#111827]">
            Raw Data
          </span>
          <span className="text-[11px] text-[#9ca3af]">
            Edit directly. Changes affect pipeline recommendations.
          </span>
        </div>
        <div className="p-4">
          {parseError && (
            <div className="mb-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-600">
              <AlertTriangle className="h-3.5 w-3.5" />
              {parseError}
            </div>
          )}
          {error && (
            <div className="mb-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-600">
              <AlertTriangle className="h-3.5 w-3.5" />
              {error}
            </div>
          )}
          <Textarea
            className="min-h-[420px] rounded-md border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] font-mono text-[11px] leading-relaxed focus:bg-white"
            value={rawJson}
            onChange={(e) => handleJsonChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
