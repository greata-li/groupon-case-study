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

const VOUCHER_CSV_DATA: Record<string, string> = {
  '1': `Voucher Code,Customer,Service,Purchase Date,Redemption Date,Status,Amount
GRP-2026-301,Sarah M.,60-Min Massage,2026-03-02,2026-03-05,Redeemed,$57.00
GRP-2026-302,Mike T.,Deep Tissue,2026-03-04,,Sold,$57.00
GRP-2026-303,Rachel W.,Hydrating Facial,2026-03-06,2026-03-09,Redeemed,$72.00
GRP-2026-304,Jason K.,90-Min Spa Package,2026-03-08,2026-03-12,Redeemed,$89.00
GRP-2026-305,Emily R.,Brazilian Wax,2026-03-10,2026-03-14,Redeemed,$39.00
GRP-2026-306,Ana P.,Lash Lift + Tint,2026-03-12,,Sold,$70.00
GRP-2026-307,Chris D.,60-Min Massage,2026-03-15,2026-03-18,Redeemed,$57.00
GRP-2026-308,Lisa M.,Deep Tissue,2026-03-18,2026-03-22,Redeemed,$57.00
GRP-2026-309,Tom B.,Hydrating Facial,2026-03-20,,Sold,$72.00
GRP-2026-310,David L.,90-Min Spa Package,2026-03-25,2026-03-28,Redeemed,$89.00`,
  '3': `Voucher Code,Customer,Service,Purchase Date,Redemption Date,Status,Amount
GRP-2026-201,Karen S.,60-Min Massage,2026-02-01,2026-02-04,Redeemed,$57.00
GRP-2026-202,Brian J.,Deep Tissue,2026-02-03,2026-02-07,Redeemed,$57.00
GRP-2026-203,Nicole F.,Hydrating Facial,2026-02-06,,Expired,$72.00
GRP-2026-204,Alex M.,90-Min Spa Package,2026-02-08,2026-02-11,Redeemed,$89.00
GRP-2026-205,Jenny L.,Brazilian Wax,2026-02-10,2026-02-14,Redeemed,$39.00
GRP-2026-206,Matt R.,Lash Lift + Tint,2026-02-13,2026-02-17,Redeemed,$70.00
GRP-2026-207,Olivia K.,60-Min Massage,2026-02-16,,Sold,$57.00
GRP-2026-208,Steve W.,Deep Tissue,2026-02-20,2026-02-24,Redeemed,$57.00`,
  '5': `Voucher Code,Customer,Service,Purchase Date,Redemption Date,Status,Amount
GRP-2026-101,Diana C.,60-Min Massage,2026-01-03,2026-01-06,Redeemed,$57.00
GRP-2026-102,Peter H.,Deep Tissue,2026-01-05,2026-01-09,Redeemed,$57.00
GRP-2026-103,Laura B.,Hydrating Facial,2026-01-07,2026-01-10,Redeemed,$72.00
GRP-2026-104,James T.,90-Min Spa Package,2026-01-10,,Expired,$89.00
GRP-2026-105,Sophia N.,Brazilian Wax,2026-01-12,2026-01-15,Redeemed,$39.00
GRP-2026-106,Ryan G.,Lash Lift + Tint,2026-01-15,2026-01-19,Redeemed,$70.00
GRP-2026-107,Megan D.,60-Min Massage,2026-01-18,2026-01-21,Redeemed,$57.00
GRP-2026-108,Kevin P.,Deep Tissue,2026-01-22,2026-01-25,Redeemed,$57.00
GRP-2026-109,Amanda S.,Hydrating Facial,2026-01-25,,Sold,$72.00
GRP-2026-110,Tyler W.,90-Min Spa Package,2026-01-28,2026-01-31,Redeemed,$89.00`,
};

const PAYMENT_CSV_DATA: Record<string, string> = {
  '2': `Payout Date,Campaign,Vouchers,Gross,Commission,Net,Status
2026-03-28,Hydrating Facial Treatment,6,$480.00,$144.00,$336.00,Pending
2026-03-21,90-Min Spa Package,12,$1080.00,$324.00,$756.00,Processed
2026-03-14,60-Min Deep Tissue Massage,9,$810.00,$243.00,$567.00,Processed
2026-03-07,Brazilian Wax Special,5,$195.00,$58.50,$136.50,Processed
2026-02-28,Lash Lift + Tint,7,$490.00,$147.00,$343.00,Processed`,
  '4': `Payout Date,Campaign,Vouchers,Gross,Commission,Net,Status
2026-02-28,Hydrating Facial Treatment,4,$288.00,$86.40,$201.60,Processed
2026-02-21,90-Min Spa Package,8,$720.00,$216.00,$504.00,Processed
2026-02-14,60-Min Deep Tissue Massage,6,$540.00,$162.00,$378.00,Processed
2026-02-07,Brazilian Wax Special,3,$117.00,$35.10,$81.90,Processed`,
};

function downloadCsv(report: MockReport) {
  let csvContent: string;

  if (report.type === 'vouchers') {
    csvContent = VOUCHER_CSV_DATA[report.id] ?? '';
  } else {
    csvContent = PAYMENT_CSV_DATA[report.id] ?? '';
  }

  if (!csvContent) return;

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.name.replace(/\s+/g, '_')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
              <Button
                variant="ghost"
                size="icon-sm"
                title="Download"
                onClick={() => downloadCsv(report)}
              >
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
