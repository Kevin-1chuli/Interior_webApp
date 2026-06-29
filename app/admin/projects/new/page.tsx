"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "",
    style: "",
    problem: "",
    solution: "",
    budgetRange: "",
  });

  const categories = [
    { id: "Living Room", label: "Living Room" },
    { id: "Bedroom", label: "Bedroom" },
    { id: "Kitchen", label: "Kitchen" },
    { id: "Bathroom", label: "Bathroom" },
    { id: "Office", label: "Office" },
    { id: "Dining Room", label: "Dining Room" },
  ];

  const styles = [
    { id: "Modern", label: "Modern" },
    { id: "Contemporary", label: "Contemporary" },
    { id: "Minimalist", label: "Minimalist" },
    { id: "Traditional", label: "Traditional" },
    { id: "Industrial", label: "Industrial" },
    { id: "Scandinavian", label: "Scandinavian" },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("Please login first");
        router.push("/admin/login");
        return;
      }

      const response = await fetch('http://localhost:4000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          location: formData.location,
          category: formData.category,
          style: formData.style,
          problem: formData.problem,
          solution: formData.solution,
          budgetRange: formData.budgetRange,
          beforeImages: [],
          afterImages: [],
          isFeatured: false
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create project');
      }

      alert("Project created successfully!");
      router.push("/admin/projects");
    } catch (error: any) {
      console.error("Failed to create project:", error);
      alert(`Failed to create project: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/admin/projects" className="hover:text-gray-900">Projects</Link>
          <span>/</span>
          <span className="text-gray-900">New Project</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Project</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="e.g., Modern Living Room Transformation"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="e.g., Kampala, Uganda"
            />
          </div>

          {/* Category & Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              >
                <option value="">Select a style</option>
                {styles.map((style) => (
                  <option key={style.id} value={style.id}>{style.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Problem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Statement
            </label>
            <textarea
              rows={3}
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="What was the challenge with this space?"
            />
          </div>

          {/* Solution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solution <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="How did you transform the space?"
            />
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <input
              type="text"
              value={formData.budgetRange}
              onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="e.g., 5M - 10M UGX"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
            <Link
              href="/admin/projects"
              className="w-full sm:w-auto text-center text-gray-700 hover:text-gray-900 font-medium px-8 py-3"
            >
              Cancel
            </Link>
          </div>

          {/* Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Images will be added in future updates. For now, projects are created with text details only.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
