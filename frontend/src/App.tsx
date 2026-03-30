import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { EndpointList } from '@/pages/admin/EndpointList';
import { EndpointDetail } from '@/pages/admin/EndpointDetail';
import { TestPanel } from '@/pages/admin/TestPanel';
import { BenchmarkEditor } from '@/pages/admin/BenchmarkEditor';
import { MerchantLayout } from '@/components/merchant/MerchantLayout';
import { Welcome } from '@/pages/merchant/Welcome';
import { MerchantFlow } from '@/pages/merchant/MerchantFlow';
import { MyDeals } from '@/pages/merchant/MyDeals';
import { CustomerPreview } from '@/pages/merchant/CustomerPreview';
import type { GeneratedDeal, MerchantIntake } from '@/lib/api';

function App() {
  // Last deal for the customer preview page
  const [lastDeal, setLastDeal] = useState<{ deal: GeneratedDeal; intake: MerchantIntake } | null>(null);

  function handleDealPublished(deal: GeneratedDeal, intake: MerchantIntake) {
    setLastDeal({ deal, intake });
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Merchant experience */}
        <Route element={<MerchantLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route
            path="/create"
            element={<MerchantFlow onPublish={handleDealPublished} />}
          />
          <Route path="/deals" element={<MyDeals />} />
        </Route>

        {/* Customer preview — full page */}
        <Route
          path="/preview-deal"
          element={
            lastDeal ? (
              <CustomerPreview deal={lastDeal.deal} intake={lastDeal.intake} />
            ) : (
              <Navigate to="/deals" replace />
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
