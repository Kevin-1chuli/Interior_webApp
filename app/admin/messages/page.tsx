"use client";

export default function MessagesPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">View and respond to contact form submissions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Messages Inbox</h3>
        <p className="text-gray-600">
          Contact form messages will appear here after backend integration
        </p>
      </div>
    </div>
  );
}
