"use client";

import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Products", value: "0", icon: "🛋️", href: "/admin/products" },
    { label: "Projects", value: "0", icon: "🏠", href: "/admin/projects" },
    { label: "Design Requests", value: "0", icon: "✨", href: "/admin/design-requests" },
    { label: "Messages", value: "0", icon: "💬", href: "/admin/messages" },
  ];

  const quickActions = [
    { label: "Add New Product", href: "/admin/products/new", icon: "➕", color: "bg-yellow-600 hover:bg-yellow-700" },
    { label: "Add Project", href: "/admin/projects/new", icon: "🏗️", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "View Requests", href: "/admin/design-requests", icon: "📋", color: "bg-purple-600 hover:bg-purple-700" },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`${action.color} text-white rounded-lg p-4 flex items-center gap-3 transition-colors`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Backend Integration Pending</h3>
            <p className="text-sm text-blue-700">
              The admin panel is ready. Connect it to your Node.js + Express + Prisma backend to start managing real data.
              Stats will update automatically once the API is connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
