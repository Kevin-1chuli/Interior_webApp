"use client";

export default function DesignRequestsPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Design Requests</h1>
        <p className="text-gray-600 mt-2">View and manage interior design requests from customers</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Design Requests Inbox</h3>
        <p className="text-gray-600">
          Customer design requests will appear here after backend integration
        </p>
      </div>
    </div>
  );
}
