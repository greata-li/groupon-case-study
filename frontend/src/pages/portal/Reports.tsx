import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  Plus,
  Loader2,
  FileBarChart,
} from 'lucide-react';

type ReportTab = 'vouchers' | 'payments';

interface Report {
  id: string;
  name: string;
  type: ReportTab;
  timeRange: string;
  filters: string;
  status: 'Ready' | 'Processing' | 'Failed';
  requestedBy: string;
  createdAt: string;
}

export function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('vouchers');
  const [reports, setReports] = useState<Report[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportType, setExportType] = useState<ReportTab>('vouchers');
  const [exportRange, setExportRange] = useState('30');
  const [exportStatus, setExportStatus] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  function handleExport() {
    setIsExporting(true);

    const rangeLabel =
      exportRange === '30'
        ? 'Last 30 days'
        : exportRange === '90'
          ? 'Last 90 days'
          : 'All time';
    const filterLabel =
      exportStatus === 'all' ? 'No filters' : `Status: ${exportStatus}`;

    setTimeout(() => {
      const newReport: Report = {
        id: `rpt-${Date.now()}`,
        name: `${exportType === 'vouchers' ? 'Voucher' : 'Payment'} Report - ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
        type: exportType,
        timeRange: rangeLabel,
        filters: filterLabel,
        status: 'Ready',
        requestedBy: 'Sofia Rodriguez',
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      };

      setReports((prev) => [newReport, ...prev]);
      setIsExporting(false);
      setShowExportDialog(false);
    }, 1500);
  }

  function filteredReports(): Report[] {
    return reports.filter((r) => r.type === activeTab);
  }

  const filtered = filteredReports();

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Exported Reports
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Download and manage your exported data reports.
          </p>
        </div>
        <Button
          className="rounded-xl bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
          onClick={() => {
            setExportType(activeTab);
            setShowExportDialog(true);
          }}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ReportTab)}>
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filtered.length === 0 ? (
            <Card>
              <CardContent>
                <div className="text-center py-16">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                    <FileBarChart className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Nothing here yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                    Your exported reports will appear here once generated. Click
                    "Export Report" to create your first report.
                  </p>
                  <Button
                    className="mt-6 rounded-xl bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
                    onClick={() => {
                      setExportType(activeTab);
                      setShowExportDialog(true);
                    }}
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Time Range</TableHead>
                    <TableHead>Filters</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {report.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {report.createdAt}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {report.timeRange}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {report.filters}
                      </TableCell>
                      <TableCell>
                        {report.status === 'Ready' && (
                          <Badge className="bg-groupon-green/10 text-groupon-green border-0 text-xs font-semibold">
                            Ready
                          </Badge>
                        )}
                        {report.status === 'Processing' && (
                          <Badge className="bg-blue-50 text-blue-700 border-0 text-xs font-semibold">
                            Processing
                          </Badge>
                        )}
                        {report.status === 'Failed' && (
                          <Badge className="bg-red-50 text-red-600 border-0 text-xs font-semibold">
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {report.requestedBy}
                      </TableCell>
                      <TableCell className="text-right">
                        {report.status === 'Ready' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-xs"
                          >
                            <Download className="mr-1.5 h-3 w-3" />
                            Download
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription>
              Configure your report settings and click export to generate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={exportType} onValueChange={(v) => setExportType(v as ReportTab)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vouchers">Vouchers</SelectItem>
                  <SelectItem value="payments">Payments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Range</Label>
              <Select value={exportRange} onValueChange={setExportRange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status Filter</Label>
              <Select value={exportStatus} onValueChange={setExportStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {exportType === 'vouchers' ? (
                    <>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="redeemed">Redeemed</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => setShowExportDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg bg-groupon-green text-white hover:bg-groupon-green-dark text-xs font-semibold"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
