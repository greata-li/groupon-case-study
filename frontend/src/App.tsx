import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Admin
import { AdminLayout } from '@/components/admin/AdminLayout';
import { EndpointList } from '@/pages/admin/EndpointList';
import { EndpointDetail } from '@/pages/admin/EndpointDetail';
import { TestPanel } from '@/pages/admin/TestPanel';
import { BenchmarkEditor } from '@/pages/admin/BenchmarkEditor';

// Legacy merchant layout (landing page + old deal flow)
import { MerchantLayout } from '@/components/merchant/MerchantLayout';
import { Welcome } from '@/pages/merchant/Welcome';
import { MerchantFlow } from '@/pages/merchant/MerchantFlow';
import { MyDeals } from '@/pages/merchant/MyDeals';
import { CustomerPreview as LegacyCustomerPreview } from '@/pages/merchant/CustomerPreview';

// New Merchant Portal
import { PortalLayout } from '@/components/merchant/PortalLayout';
import { Home } from '@/pages/portal/Home';
import { Campaigns } from '@/pages/portal/Campaigns';
import { CreateDeal } from '@/pages/portal/CreateDeal';
import { Booking } from '@/pages/portal/Booking';
import { VoucherList } from '@/pages/portal/VoucherList';
import { Reviews } from '@/pages/portal/Reviews';
import { Payments } from '@/pages/portal/Payments';
import { Reports } from '@/pages/portal/Reports';
import { Support } from '@/pages/portal/Support';
import { Profile } from '@/pages/portal/Profile';
import { Connections } from '@/pages/portal/Connections';
import { CustomerPreview } from '@/pages/portal/CustomerPreview';

// Onboarding
import { OnboardingFlow } from '@/pages/onboarding/OnboardingFlow';

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
        {/* ── Merchant Portal (sidebar layout) ── */}
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<Navigate to="/portal/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="create" element={<CreateDeal />} />
          <Route path="booking" element={<Booking />} />
          <Route path="vouchers" element={<VoucherList />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="support" element={<Support />} />
          <Route path="profile" element={<Profile />} />
          <Route path="connections" element={<Connections />} />
          <Route path="preview/:id" element={<CustomerPreview />} />
        </Route>

        {/* ── Business Onboarding (full-screen flow) ── */}
        <Route path="/onboarding" element={<OnboardingFlow />} />

        {/* ── Landing page (Welcome) ── */}
        <Route element={<MerchantLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/create"
            element={<MerchantFlow onPublish={handleDealPublished} />}
          />
          <Route path="/deals" element={<MyDeals />} />
        </Route>

        {/* Legacy customer preview (full page) */}
        <Route
          path="/preview-deal"
          element={
            lastDeal ? (
              <LegacyCustomerPreview deal={lastDeal.deal} intake={lastDeal.intake} />
            ) : (
              <Navigate to="/portal/campaigns" replace />
            )
          }
        />

        {/* ── Admin panel ── */}
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
