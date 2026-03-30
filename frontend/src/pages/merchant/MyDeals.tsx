import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Eye,
  Edit3,
  BarChart3,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  DollarSign,
} from 'lucide-react';
import type { GeneratedDeal, MerchantIntake } from '@/lib/api';

interface MyDealsProps {
  deals: Array<{ deal: GeneratedDeal; intake: MerchantIntake; publishedAt: string }>;
}

export function MyDeals({ deals }: MyDealsProps) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">My Deals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your active deals and create new ones.
          </p>
        </div>
        <Button
          onClick={() => navigate('/create')}
          className="rounded-xl bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Deal
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="Active Deals" value={String(deals.length)} />
        <StatCard icon={Users} label="Total Views" value="—" subtitle="Goes live in 24h" />
        <StatCard icon={DollarSign} label="Revenue" value="—" subtitle="No sales yet" />
      </div>

      {/* Deals list */}
      {deals.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-groupon-green/10">
            <Plus className="h-6 w-6 text-groupon-green" />
          </div>
          <h3 className="font-heading text-lg font-bold text-gray-900">No deals yet</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first deal to start getting customers.</p>
          <Button
            onClick={() => navigate('/create')}
            className="mt-6 rounded-xl bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
          >
            Create My First Deal
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map((item, i) => {
            const services = item.deal?.services || [];
            return (
              <div
                key={i}
                className="flex items-center gap-5 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md"
              >
                {/* Image placeholder */}
                <div className="h-20 w-20 shrink-0 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-gray-300" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-gray-900 truncate">
                      {item.deal?.title || 'Untitled Deal'}
                    </h3>
                    <Badge className="bg-groupon-green/10 text-groupon-green border-0 text-xs font-bold shrink-0">
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {item.intake.business_name} — {item.intake.location}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Published {item.publishedAt}
                    </span>
                    <span>
                      {services.length} option{services.length !== 1 ? 's' : ''}
                    </span>
                    {services.length > 0 && (
                      <span className="text-groupon-green font-medium">
                        From ${Math.min(...services.map((s) => s.deal_price))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/preview-deal')}
                    className="rounded-lg text-xs"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/create')}
                    className="rounded-lg text-xs"
                  >
                    <Edit3 className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <span className="font-heading text-2xl font-extrabold text-gray-900">{value}</span>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}
