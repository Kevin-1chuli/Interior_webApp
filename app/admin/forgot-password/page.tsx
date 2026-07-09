"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Reset</h1>
            <p className="text-sm text-gray-600">
              Contact your administrator to reset your password
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-amber-900 mb-4">
              <strong>For Staff Members:</strong>
            </p>
            <p className="text-sm text-amber-800">
              Please contact the manager to reset your password. They can generate a new temporary password for you through the Staff Management page.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-sm text-blue-900 mb-4">
              <strong>For Account Managers:</strong>
            </p>
            <p className="text-sm text-blue-800">
              If you've lost access to your manager account, please contact technical support at:
            </p>
            <p className="text-sm font-medium text-blue-900 mt-2">
              support@ngbinterior.com
            </p>
          </div>

          <Link
            href="/admin/login"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Secure admin access for NGB Interior Concepts
        </p>
      </div>
    </div>
  );
}
