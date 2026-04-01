import { useState, useRef } from 'react';
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
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Ticket,
  ClipboardList,
} from 'lucide-react';

interface BulkBatch {
  id: string;
  fileName: string;
  dateTime: string;
  submitted: number;
  successful: number;
  failed: number;
  status: 'Completed' | 'Processing' | 'Failed';
}

export function BulkRedeem() {
  const [codes, setCodes] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [batches, setBatches] = useState<BulkBatch[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleManualRedeem() {
    if (!codes.trim()) return;
    setIsRedeeming(true);

    const codeList = codes
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    // Simulate processing
    setTimeout(() => {
      const successful = Math.max(1, codeList.length - Math.floor(Math.random() * 2));
      const failed = codeList.length - successful;

      const newBatch: BulkBatch = {
        id: `batch-${Date.now()}`,
        fileName: 'Manual Entry',
        dateTime: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        submitted: codeList.length,
        successful,
        failed,
        status: failed > 0 && successful === 0 ? 'Failed' : 'Completed',
      };

      setBatches((prev) => [newBatch, ...prev]);
      setCodes('');
      setIsRedeeming(false);
    }, 1500);
  }

  function handleFileUpload(file: File | null) {
    if (!file) return;
    setFileName(file.name);
    setIsUploading(true);

    // Simulate upload + processing
    setTimeout(() => {
      const submitted = Math.floor(Math.random() * 20) + 10;
      const successful = submitted - Math.floor(Math.random() * 3);
      const failed = submitted - successful;

      const newBatch: BulkBatch = {
        id: `batch-${Date.now()}`,
        fileName: file.name,
        dateTime: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        submitted,
        successful,
        failed,
        status: 'Completed',
      };

      setBatches((prev) => [newBatch, ...prev]);
      setFileName(null);
      setIsUploading(false);
    }, 2000);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFileUpload(file);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Bulk Redemption
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Redeem multiple voucher codes at once by entering them manually or
          uploading a CSV file.
        </p>
      </div>

      {/* Two-column methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Manual entry */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-groupon-green/10">
                <ClipboardList className="h-4 w-4 text-groupon-green" />
              </div>
              <CardTitle className="text-sm font-bold">Manual Entry</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Enter voucher codes below, one per line.
            </p>
            <Textarea
              placeholder={
                'GRP-8A4F-2K9M\nGRP-3B7E-5N2P\nGRP-9C2D-8K4L'
              }
              value={codes}
              onChange={(e) => setCodes(e.target.value)}
              className="min-h-32 font-mono text-xs"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                {codes.split('\n').filter((c) => c.trim()).length} code(s) entered
              </span>
              <Button
                className="rounded-lg bg-groupon-green text-white hover:bg-groupon-green-dark text-xs font-semibold"
                size="sm"
                onClick={handleManualRedeem}
                disabled={!codes.trim() || isRedeeming}
              >
                {isRedeeming && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                Redeem
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File upload */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-groupon-green/10">
                <Upload className="h-4 w-4 text-groupon-green" />
              </div>
              <CardTitle className="text-sm font-bold">File Upload</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Upload a CSV file containing voucher codes in the first column.
            </p>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-groupon-green bg-groupon-green/5'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
              />
              <Upload className="h-8 w-8 text-gray-300 mb-2" />
              {fileName ? (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FileText className="h-4 w-4" />
                  {fileName}
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 font-medium">
                    Drag and drop your CSV here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to browse files
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-end mt-3">
              <Button
                className="rounded-lg bg-groupon-green text-white hover:bg-groupon-green-dark text-xs font-semibold"
                size="sm"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                Upload
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch history */}
      <Separator className="mb-6" />
      <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">
        Redemption History
      </h2>

      {batches.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <Ticket className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-heading text-base font-bold text-gray-900">
                No bulk redemptions yet
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                Your bulk redemption batches will appear here once you submit
                voucher codes above.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bulk Batch</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-center">Submitted</TableHead>
                <TableHead className="text-center">Successful</TableHead>
                <TableHead className="text-center">Failed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch, index) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium text-gray-900">
                    Batch #{batches.length - index}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-gray-600">{batch.fileName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{batch.dateTime}</TableCell>
                  <TableCell className="text-center font-medium">
                    {batch.submitted}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="flex items-center justify-center gap-1 text-groupon-green font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {batch.successful}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`flex items-center justify-center gap-1 font-medium ${
                        batch.failed > 0 ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {batch.failed}
                    </span>
                  </TableCell>
                  <TableCell>
                    {batch.status === 'Completed' && (
                      <Badge className="bg-groupon-green/10 text-groupon-green border-0 text-xs font-semibold">
                        Completed
                      </Badge>
                    )}
                    {batch.status === 'Processing' && (
                      <Badge className="bg-blue-50 text-blue-700 border-0 text-xs font-semibold">
                        Processing
                      </Badge>
                    )}
                    {batch.status === 'Failed' && (
                      <Badge className="bg-red-50 text-red-600 border-0 text-xs font-semibold">
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
