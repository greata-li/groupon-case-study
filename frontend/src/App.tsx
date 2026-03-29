import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { EndpointList } from '@/pages/admin/EndpointList';
import { EndpointDetail } from '@/pages/admin/EndpointDetail';
import { TestPanel } from '@/pages/admin/TestPanel';
import { BenchmarkEditor } from '@/pages/admin/BenchmarkEditor';
import { MerchantLayout } from '@/components/merchant/MerchantLayout';
import { Welcome } from '@/pages/merchant/Welcome';
import { MerchantFlow } from '@/pages/merchant/MerchantFlow';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Merchant experience (Sofia's side) */}
        <Route element={<MerchantLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/create" element={<MerchantFlow />} />
        </Route>

        {/* Admin panel (PM's workbench) */}
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
