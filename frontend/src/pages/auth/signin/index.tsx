import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../config/firebase';
import { Chrome } from 'lucide-react';

const SignIn: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign in with Google');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Sign In</h2>

        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          <Chrome className="h-5 w-5 text-blue-500" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
