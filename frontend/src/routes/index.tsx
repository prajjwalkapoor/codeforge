import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/landing';
import SignIn from '../pages/auth/signin';
import Dashboard from '../pages/dashboard';
import DashboardLayout from '../components/layout/dashboard-layout';
import PricingPage from '@/pages/pricing';
import SLA from '@/pages/SLA';
import NavLaout from '@/components/layout/nav-layout';

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
      <NavLaout>
        <PricingPage />
      </NavLaout>
    )
  },
  {
    path: 'sla',
    element: <SLA />
  }
]);

export default router;
