import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchDeals, deleteDeal, updateDealStatus, type PublishedDeal } from '@/lib/api';
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
import {
  Plus,
  Eye,
  Edit3,
  Trash2,
  Loader2,
  Megaphone,
} from 'lucide-react';

export function Campaigns() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [deals, setDeals] = useState<PublishedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const initialTab = searchParams.get('tab') ?? 'all';

  useEffect(() => {
    fetchDeals()
      .then((d) => setDeals(Array.isArray(d) ? d : []))
      .catch(() => setDeals([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await deleteDeal(id);
      setDeals((prev) => prev.filter((d) => d.id !== id));
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  }

  function filterDeals(tab: string) {
    if (tab === 'active') return deals.filter((d) => d.status === 'active');
    if (tab === 'drafts') return deals.filter((d) => d.status === 'draft');
    return deals;
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function statusColor(status?: string) {
    switch (status) {
      case 'active':
        return 'bg-groupon-green/10 text-groupon-green border-0';
      case 'draft':
        return 'bg-amber-50 text-amber-600 border-0';
      case 'paused':
        return 'bg-gray-100 text-gray-500 border-0';
      default:
        return 'bg-gray-100 text-gray-500 border-0';
    }
  }

  function renderTable(filtered: PublishedDeal[]) {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading campaigns...
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-groupon-green/10">
            <Megaphone className="h-6 w-6 text-groupon-green" />
          </div>
          <h3 className="font-heading text-lg font-bold text-gray-900">No campaigns yet</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first deal to start getting customers.</p>
          <Button
            onClick={() => navigate('/portal/create')}
            className="mt-6 rounded-lg bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((deal) => (
            <TableRow key={deal.id} className="hover:bg-gray-50/50 transition-colors">
              <TableCell>
                <button
                  onClick={() => navigate(`/portal/preview/${deal.id}`)}
                  className="text-sm font-medium text-gray-900 hover:text-groupon-green transition-colors text-left"
                >
                  {deal.deal?.title ?? 'Untitled Deal'}
                </button>
                <p className="text-xs text-gray-400 mt-0.5">
                  {deal.intake?.business_name ?? ''}
                </p>
              </TableCell>
              <TableCell>
                <select
                  value={deal.status || 'active'}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    try {
                      await updateDealStatus(deal.id, newStatus);
                      setDeals((prev) => prev.map((d) => d.id === deal.id ? { ...d, status: newStatus } : d));
                    } catch { /* ignore */ }
                  }}
                  className={`rounded-md border px-2 py-1 text-xs font-bold capitalize cursor-pointer ${statusColor(deal.status)}`}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-sm text-gray-500">
                {formatDate(deal.published_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => navigate(`/portal/preview/${deal.id}`)}
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => navigate(`/portal/create?edit=${deal.id}`)}
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(deal.id)}
                    disabled={deleting === deal.id}
                    title="Delete"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    {deleting === deal.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your deals and campaigns.</p>
        </div>
        <Button
          onClick={() => navigate('/portal/create')}
          className="rounded-lg bg-groupon-green font-bold text-white hover:bg-groupon-green-dark"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={initialTab}>
        <TabsList variant="line">
          <TabsTrigger value="all">All ({deals.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({deals.filter((d) => d.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({deals.filter((d) => d.status === 'draft').length})</TabsTrigger>
        </TabsList>
        <div className="mt-4 rounded-xl border border-gray-200 bg-white overflow-x-auto">
          <TabsContent value="all">{renderTable(filterDeals('all'))}</TabsContent>
          <TabsContent value="active">{renderTable(filterDeals('active'))}</TabsContent>
          <TabsContent value="drafts">{renderTable(filterDeals('drafts'))}</TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
