import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { features, pricingPlans } from '../../constants/data.tsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';

const LandingPage: FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="mb-16 flex items-center justify-between">
          <div className="text-2xl font-bold">CodeForge</div>
          {renderAuthButtons()}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-32 text-center"
        >
          <h1 className="mb-6 text-6xl font-bold">
            Execute Code at the Speed of Thought
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
            Powerful, secure, and scalable code execution API for your
            applications. Run code in any language, anywhere, anytime.
          </p>
          <button
            onClick={() => navigate(user ? '/dashboard' : '/auth/signin')}
            className="group inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 text-lg font-semibold hover:bg-indigo-700"
          >
            {user ? 'Go to Dashboard' : 'Start Building'}
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-4xl font-bold">
            Why Choose CodeForge?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl bg-gray-700 p-6"
              >
                <div className="mb-4 w-fit rounded-lg bg-indigo-600 p-2">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-4xl font-bold">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl bg-gray-700 p-6"
              >
                <h3 className="mb-2 text-2xl font-semibold">{plan.name}</h3>
                <div className="mb-4 text-4xl font-bold text-indigo-400">
                  {plan.price}
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-indigo-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full rounded-lg bg-indigo-600 py-2 font-semibold hover:bg-indigo-700">
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
