import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, FileText, BarChart3 } from 'lucide-react';

interface MockReport {
  id: string;
  name: string;
  dateRange: string;
  generatedAt: string;
  type: 'vouchers' | 'payments';
  format: string;
  size: string;
}

const MOCK_REPORTS: MockReport[] = [
  {
    id: '1',
    name: 'Voucher Summary - March 2026',
    dateRange: 'Mar 1 - Mar 31, 2026',
    generatedAt: '2026-03-31T18:00:00Z',
    type: 'vouchers',
    format: 'CSV',
    size: '12 KB',
  },
  {
    id: '2',
    name: 'Payment Report - March 2026',
    dateRange: 'Mar 1 - Mar 31, 2026',
    generatedAt: '2026-03-31T18:00:00Z',
    type: 'payments',
    format: 'CSV',
    size: '8 KB',
  },
  {
    id: '3',
    name: 'Voucher Summary - February 2026',
    dateRange: 'Feb 1 - Feb 28, 2026',
    generatedAt: '2026-02-28T18:00:00Z',
    type: 'vouchers',
    format: 'CSV',
    size: '9 KB',
  },
  {
    id: '4',
    name: 'Payment Report - February 2026',
    dateRange: 'Feb 1 - Feb 28, 2026',
    generatedAt: '2026-02-28T18:00:00Z',
    type: 'payments',
    format: 'CSV',
    size: '6 KB',
  },
  {
    id: '5',
    name: 'Voucher Summary - January 2026',
    dateRange: 'Jan 1 - Jan 31, 2026',
    generatedAt: '2026-01-31T18:00:00Z',
    type: 'vouchers',
    format: 'CSV',
    size: '14 KB',
  },
];

function filterReports(reports: MockReport[], type: string) {
  if (type === 'all') return reports;
  return reports.filter((r) => r.type === type);
}

function renderTable(reports: MockReport[]) {
  if (reports.length === 0) {
    return (
      <div className="py-16 text-center">
        <FileText className="mx-auto h-10 w-10 text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-900">No reports available</p>
        <p className="text-xs text-gray-500 mt-1">Reports will appear here once generated.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Report Name</TableHead>
          <TableHead>Date Range</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Format</TableHead>
          <TableHead>Size</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{report.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-sm text-gray-500">{report.dateRange}</TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={`text-xs capitalize ${
                  report.type === 'vouchers'
                    ? 'bg-blue-50 text-blue-600 border-0'
                    : 'bg-groupon-green/10 text-groupon-green border-0'
                }`}
              >
                {report.type}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-gray-500">{report.format}</TableCell>
            <TableCell className="text-sm text-gray-500">{report.size}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon-sm" title="Download">
                <Download className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function Reports() {
  return (
    <div className="p-6 max-w-5xl animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">View and export your business reports.</p>
        </div>
        <Button className="rounded-lg bg-groupon-green font-bold text-white hover:bg-groupon-green-dark">
          <Download className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">Total Reports</span>
          </div>
          <p className="font-heading text-2xl font-extrabold text-gray-900">{MOCK_REPORTS.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-gray-500">Voucher Reports</span>
          </div>
          <p className="font-heading text-2xl font-extrabold text-gray-900">
            {MOCK_REPORTS.filter((r) => r.type === 'vouchers').length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-groupon-green" />
            <span className="text-xs text-gray-500">Payment Reports</span>
          </div>
          <p className="font-heading text-2xl font-extrabold text-gray-900">
            {MOCK_REPORTS.filter((r) => r.type === 'payments').length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList variant="line">
          <TabsTrigger value="all">All ({MOCK_REPORTS.length})</TabsTrigger>
          <TabsTrigger value="vouchers">
            Vouchers ({MOCK_REPORTS.filter((r) => r.type === 'vouchers').length})
          </TabsTrigger>
          <TabsTrigger value="payments">
            Payments ({MOCK_REPORTS.filter((r) => r.type === 'payments').length})
          </TabsTrigger>
        </TabsList>
        <div className="mt-4 rounded-xl border border-gray-200 bg-white">
          <TabsContent value="all">{renderTable(filterReports(MOCK_REPORTS, 'all'))}</TabsContent>
          <TabsContent value="vouchers">{renderTable(filterReports(MOCK_REPORTS, 'vouchers'))}</TabsContent>
          <TabsContent value="payments">{renderTable(filterReports(MOCK_REPORTS, 'payments'))}</TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
