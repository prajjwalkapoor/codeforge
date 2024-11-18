import { FC, useEffect, useState, useCallback } from 'react';
import { Code2, Key, Trash2, Copy, AlertCircle } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase';

import axios from 'axios';
import {
  doc,
  deleteDoc,
  query,
  where,
  collection,
  getDocs,
  updateDoc
} from 'firebase/firestore';

interface TokenData {
  type: string;
  token: string;
  createdAt: string;
  user_email: string;
  requestCount: number;
  lastReset: string;
}

interface TokenLimitStatus {
  isLimited: boolean;
  limitMessage: string;
  tierLimit: number;
}

const TIER_LIMITS = {
  free: 10,
  hobby: 500,
  business: 10000
};

const Dashboard: FC = () => {
  const [user] = useAuthState(auth);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitStatus, setLimitStatus] = useState<TokenLimitStatus>({
    isLimited: false,
    limitMessage: '',
    tierLimit: 0
  });

  // Fetch token data
  const fetchTokenData = useCallback(async () => {
    if (!user?.email) return;

    try {
      const q = query(
        collection(db, 'tokenUsage'),
        where('user_email', '==', user.email)
      );
      const querySnapshot = await getDocs(q);
      const tokensList: TokenData[] = [];
      let highestTierLimit = TIER_LIMITS.free;
      let totalRequestsToday = 0;
      const today = new Date().toISOString().split('T')[0];

      // Helper function to check if a date is yesterday or older
      const needsReset = (dateStr: string) => {
        const lastResetDate = new Date(dateStr);
        const todayDate = new Date();
        // Reset timezone to compare dates properly
        lastResetDate.setHours(0, 0, 0, 0);
        todayDate.setHours(0, 0, 0, 0);
        return lastResetDate < todayDate;
      };

      // Process each token
      for (const document of querySnapshot.docs) {
        const token_data = document.data();
        const lastReset = token_data.lastReset;

        // Reset counter if last reset was yesterday or older
        if (needsReset(lastReset)) {
          const tokenRef = doc(db, 'tokenUsage', document.id);
          const now = new Date().toISOString();

          // Update Firestore
          await updateDoc(tokenRef, {
            requestCount: 0,
            lastReset: now
          });

          // Update local data
          token_data.requestCount = 0;
          token_data.lastReset = now;
        }

        // Count today's requests
        if (token_data.lastReset.split('T')[0] === today) {
          totalRequestsToday += token_data.requestCount;
        }

        // Track highest tier limit
        if (TIER_LIMITS[token_data.type] > highestTierLimit) {
          highestTierLimit = TIER_LIMITS[token_data.type];
        }

        tokensList.push({
          token: document.id,
          createdAt: token_data.createdAt,
          lastReset: token_data.lastReset,
          requestCount: token_data.requestCount,
          type: token_data.type,
          user_email: token_data.user_email
        });
      }

      // Check if limit is reached
      if (totalRequestsToday >= highestTierLimit) {
        setLimitStatus({
          isLimited: true,
          limitMessage: `You've reached today's limit of ${highestTierLimit} requests across all your tokens.`,
          tierLimit: highestTierLimit
        });
      } else {
        setLimitStatus({
          isLimited: false,
          limitMessage: '',
          tierLimit: highestTierLimit
        });
      }

      setTokens(tokensList);
    } catch (err) {
      console.error('Error fetching tokens:', err);
      setError('Failed to fetch token data');
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchTokenData();
  }, [fetchTokenData, user]);

  const generateToken = async () => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:5000/api/generate-token', {
        type: 'free',
        user_email: user.email
      });

      await fetchTokenData();
    } catch (err) {
      console.error('Error generating token:', err);
      setError('Failed to generate token');
    } finally {
      setLoading(false);
    }
  };

  // Delete token
  const deleteToken = async (token: string) => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'tokenUsage', token));
      setTokens(tokens.filter((t) => t.token !== token));
    } catch (err) {
      console.error('Error deleting token:', err);
      setError('Failed to delete token');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Optional: Add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleUpgrade = () => {
    // Implement your upgrade logic here
    window.location.href = '/pricing'; // or your upgrade page URL
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Code Execution Dashboard</h1>

      {/* Limit Alert */}
      {limitStatus.isLimited && (
        <div className="rounded-lg bg-yellow-50 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-yellow-700">
                {limitStatus.limitMessage}
              </p>
              <p className="mt-3 text-sm md:ml-6 md:mt-0">
                <button
                  onClick={handleUpgrade}
                  className="whitespace-nowrap font-medium text-yellow-700 hover:text-yellow-600"
                >
                  Upgrade now <span aria-hidden="true">&rarr;</span>
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* API Token Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gray-50 p-3">
              <Key className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">API Tokens</h2>
              <p className="text-sm text-gray-600">
                Manage your API access tokens
              </p>
            </div>
          </div>

          <button
            onClick={generateToken}
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Generate New Token
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        {tokens.length > 0 ? (
          <div className="space-y-4">
            {tokens.map((token) => (
              <div key={token.token} className="rounded-md bg-gray-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">API Token:</p>
                    <div className="flex items-center gap-2">
                      <p className="break-all font-mono text-sm">
                        {token.token}
                      </p>
                      <button
                        onClick={() => copyToClipboard(token.token)}
                        className="rounded-md p-2 text-gray-600 hover:bg-gray-200"
                        title="Copy Token"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-semibold capitalize">{token.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Requests Today</p>
                        <p className="font-semibold">{token.requestCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Created On</p>
                        <p className="font-semibold">
                          {new Date(token.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteToken(token.token)}
                    className="rounded-md p-2 text-red-600 hover:bg-red-50"
                    title="Delete Token"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No tokens generated yet</p>
        )}
      </div>

      {/* API Documentation Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">API Documentation</h2>
          <p className="text-sm text-gray-600">
            How to use the code execution API
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-md bg-gray-50 p-4">
            <h3 className="font-semibold">Execute Code</h3>
            <p className="mt-2 text-sm text-gray-600">
              Send a POST request to execute your code:
            </p>
            <div className="mt-3 space-y-2">
              <p className="font-mono text-sm">
                POST http://localhost:5000/run-code
              </p>
              <p className="text-sm text-gray-600">Headers:</p>
              <div className="rounded bg-gray-100 p-2">
                <pre className="text-sm">
                  {`{
  "x-api-token": "your-api-token-here"
}`}
                </pre>
              </div>
              <p className="text-sm text-gray-600">Request Body:</p>
              <div className="rounded bg-gray-100 p-2">
                <pre className="text-sm">
                  {`{
  "lang": "javascript",
  "code": "console.log('Hello, World!');"
}`}
                </pre>
              </div>
              <p className="text-sm text-gray-600">Example Response:</p>
              <div className="rounded bg-gray-100 p-2">
                <pre className="text-sm">
                  {`{
  "output": "Hello, World!",
  "executionTime": "0.023s"
}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <h3 className="font-semibold">Rate Limits</h3>
            <div className="mt-2 space-y-2">
              <p className="text-sm">• Free Tier: 10 requests per day</p>
              <p className="text-sm">• Hobby Tier: 500 requests per day</p>
              <p className="text-sm">
                • Business Tier: 10,000 requests per day
              </p>
            </div>
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <h3 className="font-semibold">Error Handling</h3>
            <div className="mt-2 space-y-2">
              <p className="text-sm">• 401: Invalid or missing API token</p>
              <p className="text-sm">• 429: Daily rate limit exceeded</p>
              <p className="text-sm">
                • 500: Server error or code execution failed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Execution Section */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-gray-50 p-3">
            <Code2 className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Ready to Execute</p>
            <p className="text-2xl font-semibold">Start Coding</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
