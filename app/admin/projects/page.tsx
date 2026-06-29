"use client";

import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage interior design projects showcase</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          <span>Add Project</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Projects Management</h3>
        <p className="text-gray-600">
          This section will be available after backend integration
        </p>
      </div>
    </div>
  );
}
