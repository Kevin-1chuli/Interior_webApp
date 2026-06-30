"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setMessage(data.message);
      
      // In development, show the reset URL
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
            <p className="text-sm text-gray-500 mt-2">
              Enter your email to receive a password reset link
            </p>
          </div>

          {!message ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                  placeholder="Enter your email"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center">
                <Link 
                  href="/admin/login" 
                  className="text-sm text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm mb-4">
                {message}
              </div>

              {resetUrl && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md text-sm mb-4 text-left">
                  <p className="font-semibold text-blue-900 mb-2">Development Mode - Reset Link:</p>
                  <a 
                    href={resetUrl} 
                    className="text-blue-600 hover:text-blue-800 break-all underline"
                  >
                    {resetUrl}
                  </a>
                </div>
              )}

              <Link 
                href="/admin/login" 
                className="inline-block text-sm text-yellow-600 hover:text-yellow-700 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
