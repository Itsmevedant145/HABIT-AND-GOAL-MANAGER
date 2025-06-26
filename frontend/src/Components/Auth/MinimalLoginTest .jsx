import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // ✅ use auth context

const MinimalLoginTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { login } = useAuth(); // ✅ grab login function
  const navigate = useNavigate(); // ✅ to redirect

  const handleSubmit = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('Making direct fetch call...');

      const response = await fetch('http://localhost:9000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      // ✅ Call context login
      const success = login(data.token, data.user); // make sure your backend returns a `user` object too

      if (success) {
        navigate('/dashboard'); // ✅ redirect to protected route
      }

      setResult({
        success: true,
        message: data.message || 'Login successful!',
        token: data.token,
        data: data,
      });
    } catch (error) {
      console.error('Login error:', error);
      setResult({
        success: false,
        message: error.message,
        error: error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ...rest of your component stays the same


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Minimal Login Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Direct fetch to http://localhost:9000/api/auth/login
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Login'}
          </button>
        </div>

        {result && (
          <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <h3 className="font-semibold">
              {result.success ? '✅ Success!' : '❌ Error!'}
            </h3>
            <p className="mt-1">{result.message}</p>
            {result.success && result.token && (
              <p className="mt-2 text-xs break-all">
                <strong>Token:</strong> {result.token.substring(0, 50)}...
              </p>
            )}
            {result.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">View Full Response</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="mt-8 text-xs text-gray-500">
          <p><strong>Debug Info:</strong></p>
          <p>Email: {email}</p>
          <p>Password: {password ? '•'.repeat(password.length) : '(empty)'}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default MinimalLoginTest;