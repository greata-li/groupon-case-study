import { useState, useEffect } from 'react';
import { markChecklistComplete } from '@/lib/checklist';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CreditCard,
  Calendar,
  DollarSign,
  Info,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MockVoucher {
  code: string;
  customer: string;
  service: string;
  date: string;
  amount: number;
}

interface MockPayout {
  id: string;
  payoutDate: string;
  amount: number;
  campaign: string;
  status: 'processed' | 'pending' | 'scheduled';
  vouchersRedeemed: number;
  grossRevenue: number;
  commissionRate: number;
  processingFeeRate: number;
  vouchers: MockVoucher[];
}

const MOCK_PAYOUTS: MockPayout[] = [
  {
    id: '1',
    payoutDate: '2026-04-04',
    amount: 432.0,
    campaign: '60-Min Deep Tissue Massage',
    status: 'scheduled',
    vouchersRedeemed: 8,
    grossRevenue: 720.0,
    commissionRate: 0.30,
    processingFeeRate: 0.025,
    vouchers: [
      { code: 'GRP-2026-041', customer: 'Emily R.', service: '60-Min Deep Tissue', date: '2026-04-01', amount: 90.00 },
      { code: 'GRP-2026-042', customer: 'Jason K.', service: '60-Min Deep Tissue', date: '2026-04-01', amount: 90.00 },
      { code: 'GRP-2026-043', customer: 'Maria S.', service: '60-Min Deep Tissue', date: '2026-04-02', amount: 90.00 },
      { code: 'GRP-2026-044', customer: 'David L.', service: '60-Min Deep Tissue', date: '2026-04-03', amount: 90.00 },
    ],
  },
  {
    id: '2',
    payoutDate: '2026-03-28',
    amount: 288.0,
    campaign: 'Hydrating Facial Treatment',
    status: 'pending',
    vouchersRedeemed: 6,
    grossRevenue: 480.0,
    commissionRate: 0.30,
    processingFeeRate: 0.025,
    vouchers: [
      { code: 'GRP-2026-031', customer: 'Lisa M.', service: 'Hydrating Facial', date: '2026-03-24', amount: 80.00 },
      { code: 'GRP-2026-032', customer: 'Tom B.', service: 'Hydrating Facial', date: '2026-03-25', amount: 80.00 },
      { code: 'GRP-2026-033', customer: 'Ana P.', service: 'Hydrating Facial', date: '2026-03-26', amount: 80.00 },
    ],
  },
  {
    id: '3',
    payoutDate: '2026-03-21',
    amount: 576.0,
    campaign: '90-Min Spa Package',
    status: 'processed',
    vouchersRedeemed: 12,
    grossRevenue: 1080.0,
    commissionRate: 0.30,
    processingFeeRate: 0.025,
    vouchers: [
      { code: 'GRP-2026-021', customer: 'Sarah M.', service: '90-Min Spa Package', date: '2026-03-17', amount: 90.00 },
      { code: 'GRP-2026-022', customer: 'Mike T.', service: '90-Min Spa Package', date: '2026-03-18', amount: 90.00 },
      { code: 'GRP-2026-023', customer: 'Rachel W.', service: '90-Min Spa Package', date: '2026-03-19', amount: 90.00 },
      { code: 'GRP-2026-024', customer: 'Chris D.', service: '90-Min Spa Package', date: '2026-03-20', amount: 90.00 },
    ],
  },
];

export function Payments() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { markChecklistComplete('payments'); }, []);

  const nextPayoutDate = 'April 4, 2026';
  const totalPending = MOCK_PAYOUTS.filter((p) => p.status !== 'processed').reduce((sum, p) => sum + p.amount, 0);
  const totalProcessed = MOCK_PAYOUTS.filter((p) => p.status === 'processed').reduce((sum, p) => sum + p.amount, 0);

  function statusBadge(status: string) {
    switch (status) {
      case 'processed':
        return 'bg-groupon-green/10 text-groupon-green border-0';
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-0';
      case 'scheduled':
        return 'bg-blue-50 text-blue-600 border-0';
      default:
        return 'bg-gray-100 text-gray-500 border-0';
    }
  }

  function toggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="p-6 max-w-5xl animate-fade-in-up">
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">Track your payouts and earnings.</p>
      </div>

      {/* Payout banner */}
      <div className="rounded-xl bg-gradient-to-r from-groupon-green to-groupon-green-dark p-5 text-white mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-4 w-4 text-white/70" />
          <span className="text-sm text-white/80">Next Estimated Payout</span>
        </div>
        <p className="font-heading text-xl font-bold">{nextPayoutDate}</p>
        <p className="text-sm text-white/70 mt-1">
          Estimated amount: ${totalPending.toFixed(2)}
        </p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-groupon-green/10">
                <DollarSign className="h-5 w-5 text-groupon-green" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Processed</p>
                <p className="font-heading text-lg font-extrabold text-gray-900">${totalProcessed.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="font-heading text-lg font-extrabold text-gray-900">${totalPending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <CreditCard className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Method</p>
                <p className="text-sm font-medium text-gray-900">Direct Deposit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment info */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">How Payments Work</p>
            <ul className="mt-2 space-y-1 text-blue-700">
              <li>Payments are processed weekly on Fridays.</li>
              <li>Checks are mailed within 3-5 business days after processing.</li>
              <li>Direct deposit arrives within 1-2 business days.</li>
              <li>Minimum payout threshold is $25.00.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payout table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Payout Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PAYOUTS.map((payout) => {
              const isExpanded = expandedId === payout.id;
              const commission = payout.grossRevenue * payout.commissionRate;
              const processingFee = payout.grossRevenue * payout.processingFeeRate;
              const netPayout = payout.grossRevenue - commission - processingFee;

              return (
                <>
                  <TableRow
                    key={payout.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleRow(payout.id)}
                  >
                    <TableCell className="w-8 pr-0">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {new Date(payout.payoutDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="font-heading font-bold text-gray-900">
                      ${payout.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{payout.campaign}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs font-bold capitalize ${statusBadge(payout.status)}`}>
                        {payout.status === 'processed' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {payout.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow key={`${payout.id}-detail`}>
                      <TableCell colSpan={5} className="bg-gray-50/80 p-0">
                        <div className="px-6 py-4">
                          {/* Breakdown */}
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Payout Breakdown</h4>
                              <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
                                <div className="flex justify-between px-4 py-2.5">
                                  <span className="text-sm text-gray-600">Vouchers Redeemed</span>
                                  <span className="text-sm font-medium text-gray-900">{payout.vouchersRedeemed} vouchers</span>
                                </div>
                                <div className="flex justify-between px-4 py-2.5">
                                  <span className="text-sm text-gray-600">Gross Revenue</span>
                                  <span className="text-sm font-medium text-gray-900">${payout.grossRevenue.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between px-4 py-2.5">
                                  <span className="text-sm text-gray-600">Groupon Commission ({(payout.commissionRate * 100).toFixed(0)}%)</span>
                                  <span className="text-sm font-medium text-red-600">-${commission.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between px-4 py-2.5">
                                  <span className="text-sm text-gray-600">Processing Fee ({(payout.processingFeeRate * 100).toFixed(1)}%)</span>
                                  <span className="text-sm font-medium text-red-600">-${processingFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between px-4 py-3 bg-gray-50">
                                  <span className="text-sm font-bold text-gray-900">Net Payout</span>
                                  <span className="text-sm font-bold text-groupon-green">${netPayout.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Voucher list */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Recent Vouchers</h4>
                              <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
                                {payout.vouchers.map((v) => (
                                  <div key={v.code} className="flex items-center justify-between px-4 py-2.5">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{v.customer}</p>
                                      <p className="text-xs text-gray-500">
                                        <span className="font-mono">{v.code}</span>
                                        {' '}&middot; {v.service} &middot;{' '}
                                        {new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      </p>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">${v.amount.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
