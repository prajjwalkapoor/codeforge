import { auth } from '@/config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';

const NavLaout = ({ children }: { children: React.ReactNode }) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const renderAuthButtons = () => {
    if (user) {
      return (
        <button
          onClick={() => navigate('/dashboard')}
          className="rounded-lg bg-indigo-600 px-6 py-2 hover:bg-indigo-700"
        >
          View Dashboard
        </button>
      );
    }

    return (
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/auth/signin')}
          className="rounded-lg bg-gray-800 px-6 py-2 hover:bg-gray-700"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate('/auth/signin')}
          className="rounded-lg bg-indigo-600 px-6 py-2 hover:bg-indigo-700"
        >
          Get Started
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 pt-8">
        <nav className="mb-8 flex items-center justify-between">
          <div className="text-2xl font-bold">
            <Link to="/"> CodeForge</Link>
          </div>
          <div className="flex items-center justify-center gap-8">
            <Link to="/sla" className="text-lg font-semibold">
              SLA Agreement
            </Link>
            <Link to="/pricing" className="text-lg font-semibold">
              Pricing
            </Link>
            {renderAuthButtons()}
          </div>
        </nav>
      </div>
      {children}
    </div>
  );
};

export default NavLaout;
