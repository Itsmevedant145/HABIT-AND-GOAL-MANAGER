import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../UI/InputField';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthContext';

import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error('Email and password are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(API_Path.AUTH.LOGIN, {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      const { token, user } = response.data;

      if (token && user) {
        const success = login(token, user);
        if (success) {
          navigate('/dashboard');
        } else {
          toast.error('Login context failed to update.');
        }
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section: Big SVG + Catchy Lines */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex flex-col justify-center items-center p-12 text-white text-center space-y-8 min-h-[40vh] lg:min-h-screen">
        <svg
          className="w-56 h-56 sm:w-72 sm:h-72 drop-shadow-xl"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <circle cx="12" cy="12" r="9" stroke="#ffffff33" strokeWidth="3" />
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="#22c55e"
            strokeWidth="3"
            strokeDasharray="36 20"
            strokeLinecap="round"
            transform="rotate(-90 12 12)"
          />
          <path
            d="M7 15 L10 12 L14 13 L17 9"
            stroke="#c084fc"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 9 L17 9 L17 11"
            stroke="#c084fc"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
          Track Your Habits,<br />Achieve Your Goals
        </h1>
        <p className="max-w-md text-lg text-purple-200">
          Build consistency and unlock your potential with our powerful habit and goal tracker. One step closer every day.
        </p>
        <p className="max-w-md text-lg font-semibold text-green-400">
          Ready to transform your life? Let’s get started.
        </p>
      </div>

      {/* Right Section: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/20 p-8">
        <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-30" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-gradient-to-tr from-pink-100 to-indigo-100 rounded-full opacity-25" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
              <p className="text-gray-600">Enter your credentials to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
              />
              <InputField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
                showToggle={true}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

              <button
                type="submit"
                disabled={isLoading}
                className={`group w-full py-4 rounded-xl font-semibold text-white text-lg
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  hover:from-indigo-700 hover:to-purple-700
                  shadow-lg hover:shadow-xl
                  transform hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-200
                  focus:outline-none focus:ring-4 focus:ring-indigo-400/50
                  disabled:opacity-70 disabled:cursor-not-allowed
                  relative overflow-hidden
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Wait Logging... </span>
                  </div>
                ) : (
                  'Login'
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a
                  href="/signup"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors duration-200"
                >
                  Create one now
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
