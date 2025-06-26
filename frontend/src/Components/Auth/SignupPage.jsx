import React, { useState } from 'react';
import { toast } from 'react-toastify';
import InputField from '../UI/InputField';
import apiClient from '../../Utils/apiClient';
import { API_Path } from '../../Utils/apiPath';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post(API_Path.AUTH.REGISTER, {
        username,
        email,
        password,
      });

      toast.success("Account created successfully!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SECTION: Big SVG + Catchy Lines */}
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

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-8">
             
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign Up</h2>
              <p className="text-gray-600">Create a new account to start your journey</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputField
                id="username"
                label="Username"
                type="text"
                value={username}
                onChange={setUsername}
                placeholder="Enter your username"
              />

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
                type={showPassword ? 'text' : 'password'}
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
                className="group w-full py-4 rounded-xl font-semibold text-white text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing up...</span>
                  </div>
                ) : (
                  'Sign Up'
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors duration-200"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
