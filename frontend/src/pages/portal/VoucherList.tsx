import { useState, useEffect } from 'react';
import { markChecklistComplete } from '@/lib/checklist';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Ticket, Search, Download } from 'lucide-react';

interface MockVoucher {
  id: string;
  customerName: string;
  grouponCode: string;
  option: string;
  purchasedDate: string;
  status: 'sold' | 'redeemed' | 'expired' | 'refunded';
}

const MOCK_VOUCHERS: MockVoucher[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    grouponCode: 'GRP-7A2X9K',
    option: '60-Min Deep Tissue Massage',
    purchasedDate: '2026-03-28',
    status: 'sold',
  },
  {
    id: '2',
    customerName: 'Michael Chen',
    grouponCode: 'GRP-3B8M4N',
    option: 'Hydrating Facial Treatment',
    purchasedDate: '2026-03-27',
    status: 'redeemed',
  },
  {
    id: '3',
    customerName: 'Emily Rodriguez',
    grouponCode: 'GRP-5C1P7R',
    option: '90-Min Spa Package',
    purchasedDate: '2026-03-25',
    status: 'sold',
  },
  {
    id: '4',
    customerName: 'David Kim',
    grouponCode: 'GRP-9D4Q2T',
    option: '60-Min Deep Tissue Massage',
    purchasedDate: '2026-03-22',
    status: 'redeemed',
  },
  {
    id: '5',
    customerName: 'Jessica Martinez',
    grouponCode: 'GRP-6E7S1V',
    option: 'Hydrating Facial Treatment',
    purchasedDate: '2026-03-20',
    status: 'redeemed',
  },
  {
    id: '6',
    customerName: 'Amanda Taylor',
    grouponCode: 'GRP-2F0U8W',
    option: '90-Min Spa Package',
    purchasedDate: '2026-03-18',
    status: 'expired',
  },
  {
    id: '7',
    customerName: 'Robert Wilson',
    grouponCode: 'GRP-8G3V5X',
    option: '60-Min Deep Tissue Massage',
    purchasedDate: '2026-03-15',
    status: 'sold',
  },
  {
    id: '8',
    customerName: 'Lisa Nguyen',
    grouponCode: 'GRP-4H6W9Y',
    option: 'Hydrating Facial Treatment',
    purchasedDate: '2026-03-12',
    status: 'refunded',
  },
];

export function VoucherList() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { markChecklistComplete('voucher'); }, []);

  const filtered = MOCK_VOUCHERS.filter((v) => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.customerName.toLowerCase().includes(q) ||
        v.grouponCode.toLowerCase().includes(q) ||
        v.option.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function statusBadgeClass(status: string) {
    switch (status) {
      case 'sold':
        return 'bg-blue-50 text-blue-600 border-0';
      case 'redeemed':
        return 'bg-groupon-green/10 text-groupon-green border-0';
      case 'expired':
        return 'bg-gray-100 text-gray-500 border-0';
      case 'refunded':
        return 'bg-red-50 text-red-500 border-0';
      default:
        return 'bg-gray-100 text-gray-500 border-0';
    }
  }

  const stats = {
    total: MOCK_VOUCHERS.length,
    sold: MOCK_VOUCHERS.filter((v) => v.status === 'sold').length,
    redeemed: MOCK_VOUCHERS.filter((v) => v.status === 'redeemed').length,
    expired: MOCK_VOUCHERS.filter((v) => v.status === 'expired').length,
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-gray-900">Voucher List</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage customer vouchers.</p>
        </div>
        <Button variant="outline" className="rounded-lg text-xs">
          <Download className="mr-1 h-3.5 w-3.5" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Vouchers', value: stats.total, color: 'text-gray-900' },
          { label: 'Sold', value: stats.sold, color: 'text-blue-600' },
          { label: 'Redeemed', value: stats.redeemed, color: 'text-groupon-green' },
          { label: 'Expired', value: stats.expired, color: 'text-gray-500' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`font-heading text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
            placeholder="Search vouchers..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1">
          {['all', 'sold', 'redeemed', 'expired', 'refunded'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Ticket className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-900">No vouchers found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Groupon Code</TableHead>
                <TableHead>Option</TableHead>
                <TableHead>Purchased</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell className="font-medium">{voucher.customerName}</TableCell>
                  <TableCell>
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">
                      {voucher.grouponCode}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{voucher.option}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(voucher.purchasedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs font-bold capitalize ${statusBadgeClass(voucher.status)}`}>
                      {voucher.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
