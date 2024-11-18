import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/landing';
import SignIn from '../pages/auth/signin';
import Dashboard from '../pages/dashboard';
import DashboardLayout from '../components/layout/dashboard-layout';
import PricingPage from '@/pages/pricing';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/auth/signin',
    element: <SignIn />
  },
  {
    path: '/dashboard',
    element: (
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    )
  },
  {
    path: '/pricing',
    element: (
      <DashboardLayout>
        <PricingPage />
      </DashboardLayout>
    )
  }
]);

export default router;
