import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Admin
import { AdminLayout } from '@/components/admin/AdminLayout';
import { EndpointList } from '@/pages/admin/EndpointList';
import { EndpointDetail } from '@/pages/admin/EndpointDetail';
import { TestPanel } from '@/pages/admin/TestPanel';
import { BenchmarkEditor } from '@/pages/admin/BenchmarkEditor';
import { PipelineAnalytics } from '@/pages/admin/PipelineAnalytics';

// Landing page
import { MerchantLayout } from '@/components/merchant/MerchantLayout';
import { Welcome } from '@/pages/merchant/Welcome';

// Merchant Portal
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
import { ConversationalOnboarding } from '@/pages/onboarding/ConversationalOnboarding';

function App() {
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

        {/* ── Business Onboarding ── */}
        <Route path="/onboarding" element={<ConversationalOnboarding />} />

        {/* ── Landing page ── */}
        <Route element={<MerchantLayout />}>
          <Route path="/" element={<Welcome />} />
        </Route>

        {/* ── Redirects from old routes ── */}
        <Route path="/create" element={<Navigate to="/portal/create" replace />} />
        <Route path="/deals" element={<Navigate to="/portal/campaigns" replace />} />
        <Route path="/preview-deal" element={<Navigate to="/portal/campaigns" replace />} />
        <Route path="/onboarding/classic" element={<Navigate to="/onboarding" replace />} />

        {/* ── Admin panel ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<EndpointList />} />
          <Route path="endpoint/:id" element={<EndpointDetail />} />
          <Route path="test" element={<TestPanel />} />
          <Route path="benchmarks" element={<BenchmarkEditor />} />
          <Route path="analytics" element={<PipelineAnalytics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
