import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Admin
import { AdminLayout } from '@/components/admin/AdminLayout';
import { EndpointList } from '@/pages/admin/EndpointList';
import { EndpointDetail } from '@/pages/admin/EndpointDetail';
import { TestPanel } from '@/pages/admin/TestPanel';
import { BenchmarkEditor } from '@/pages/admin/BenchmarkEditor';

// Merchant portal
import { PortalLayout } from '@/components/merchant/PortalLayout';
import { Home } from '@/pages/portal/Home';
import { Campaigns } from '@/pages/portal/Campaigns';
import { Booking } from '@/pages/portal/Booking';
import { VoucherList } from '@/pages/portal/VoucherList';
import { BulkRedeem } from '@/pages/portal/BulkRedeem';
import { CustomerReviews } from '@/pages/portal/CustomerReviews';
import { Payments } from '@/pages/portal/Payments';
import { Reports } from '@/pages/portal/Reports';
import { Connections } from '@/pages/portal/Connections';
import { Support } from '@/pages/portal/Support';

// Merchant flows (keep old layout for welcome + deal creation)
import { MerchantLayout } from '@/components/merchant/MerchantLayout';
import { Welcome } from '@/pages/merchant/Welcome';
import { MerchantFlow } from '@/pages/merchant/MerchantFlow';
import { CustomerPreview } from '@/pages/merchant/CustomerPreview';

import type { GeneratedDeal, MerchantIntake } from '@/lib/api';

function App() {
  const [lastDeal, setLastDeal] = useState<{
    deal: GeneratedDeal;
    intake: MerchantIntake;
  } | null>(null);

  function handleDealPublished(deal: GeneratedDeal, intake: MerchantIntake) {
    setLastDeal({ deal, intake });
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing / Welcome */}
        <Route element={<MerchantLayout />}>
          <Route path="/" element={<Welcome />} />
        </Route>

        {/* Deal creation flow (standalone, no sidebar) */}
        <Route element={<MerchantLayout />}>
          <Route
            path="/create"
            element={<MerchantFlow onPublish={handleDealPublished} />}
          />
        </Route>

        {/* Merchant Portal (sidebar layout) */}
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<Navigate to="/portal/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="create" element={<MerchantFlow onPublish={handleDealPublished} />} />
          <Route path="booking" element={<Booking />} />
          <Route path="vouchers" element={<VoucherList />} />
          <Route path="bulk-redeem" element={<BulkRedeem />} />
          <Route path="reviews" element={<CustomerReviews />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="support" element={<Support />} />
          <Route path="connections" element={<Connections />} />
        </Route>

        {/* Customer preview (full page, no layout) */}
        <Route
          path="/preview-deal"
          element={
            lastDeal ? (
              <CustomerPreview deal={lastDeal.deal} intake={lastDeal.intake} />
            ) : (
              <Navigate to="/portal/campaigns" replace />
            )
          }
        />

        {/* Admin panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<EndpointList />} />
          <Route path="endpoint/:id" element={<EndpointDetail />} />
          <Route path="test" element={<TestPanel />} />
          <Route path="benchmarks" element={<BenchmarkEditor />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
