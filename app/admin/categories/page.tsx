"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderTree, Eye, EyeOff, Save, X } from "lucide-react";
import { getApiUrl } from "@/lib/config";
import { authenticatedFetch, isOwner as checkIsOwner } from "@/lib/auth";
import * as XLSX from 'xlsx';
import { useAdminExport } from "@/context/AdminExportContext";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isOwner = checkIsOwner();
  const { registerExport, unregisterExport } = useAdminExport();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    sortOrder: 0,
    isActive: true
  });

  const exportToExcel = () => {
    if (categories.length === 0) {
      alert('No categories to export');
      return;
    }

    const exportData = categories.map(cat => ({
      'Name': cat.name,
      'Slug': cat.slug,
      'Description': cat.description || 'N/A',
      'Products': cat._count?.products || 0,
      'Sort Order': cat.sortOrder,
      'Status': cat.isActive ? 'Active' : 'Inactive',
      'Created': new Date(cat.createdAt).toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Categories');
    const fileName = `categories_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  useEffect(() => {
    registerExport(exportToExcel, 'Export Categories');
    return () => unregisterExport();
  }, [categories, registerExport, unregisterExport]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(getApiUrl('categories?includeInactive=true'));
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      sortOrder: 0,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      sortOrder: category.sortOrder,
      isActive: category.isActive
    });
    setEditingId(category.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const url = editingId 
        ? getApiUrl(`categories/${editingId}`)
        : getApiUrl('categories');
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await authenticatedFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save category');
      }

      await fetchCategories();
      resetForm();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string, productCount: number) => {
    if (productCount > 0) {
      alert(`Cannot delete "${name}". It has ${productCount} product${productCount > 1 ? 's' : ''} assigned to it. Please reassign or delete those products first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await authenticatedFetch(getApiUrl(`categories/${id}`), {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete category');
      }

      await fetchCategories();
    } catch (error: any) {
      alert(`Failed to delete: ${error.message}`);
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      const response = await authenticatedFetch(getApiUrl(`categories/${category.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: category.name,
          isActive: !category.isActive
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update category');
      }

      await fetchCategories();
    } catch (error: any) {
      alert(`Failed to update: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5f0" }}>
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#1e1e1e", fontFamily: "'Playfair Display', serif" }}>
              Categories
            </h1>
            <p className="text-base" style={{ color: "#6b6560" }}>
              Manage product categories
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-lg transition-all hover:shadow-lg"
              style={{ backgroundColor: "#b8934a", color: "white" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#d4ac6e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#b8934a";
              }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-6 bg-white rounded-lg border p-6 shadow-sm" style={{ borderColor: "#ede9e2" }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: "#1e1e1e", fontFamily: "'Playfair Display', serif" }}>
              {editingId ? 'Edit Category' : 'Create New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1e1e1e" }}>
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                    style={{ border: "2px solid #ede9e2" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#b8934a"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#ede9e2"; }}
                    placeholder="e.g., Office Furniture"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1e1e1e" }}>
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                    style={{ border: "2px solid #ede9e2" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#b8934a"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#ede9e2"; }}
                    placeholder="e.g., office-furniture"
                  />
                  <p className="text-xs mt-1" style={{ color: "#6b6560" }}>
                    URL-friendly identifier (lowercase, hyphens only)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1e1e1e" }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-all resize-none"
                  style={{ border: "2px solid #ede9e2" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#b8934a"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#ede9e2"; }}
                  placeholder="Brief description of this category..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1e1e1e" }}>
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                  style={{ border: "2px solid #ede9e2" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#b8934a"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#ede9e2"; }}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1e1e1e" }}>
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                    style={{ border: "2px solid #ede9e2" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#b8934a"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#ede9e2"; }}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#1e1e1e" }}>
                    Status
                  </label>
                  <select
                    value={formData.isActive ? "active" : "inactive"}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                    style={{ border: "2px solid #ede9e2" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#b8934a"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#ede9e2"; }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50"
                  style={{ backgroundColor: "#b8934a", color: "white" }}
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : editingId ? "Update Category" : "Create Category"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all"
                  style={{ border: "2px solid #ede9e2", color: "#6b6560" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f8f5f0"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center" style={{ borderColor: "#ede9e2" }}>
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#f8f5f0" }}
            >
              <FolderTree className="w-8 h-8" style={{ color: "#b8934a" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#1e1e1e", fontFamily: "'Playfair Display', serif" }}>
              No categories yet
            </h3>
            <p className="mb-6" style={{ color: "#6b6560" }}>
              Create your first category to organize products
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: "#ede9e2" }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#f8f5f0", borderBottom: "1px solid #ede9e2" }}>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560" }}>
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560" }}>
                      Slug
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560" }}>
                      Products
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560" }}>
                      Sort
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560" }}>
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, idx) => (
                    <tr 
                      key={category.id}
                      className="transition-colors"
                      style={{ borderBottom: idx < categories.length - 1 ? "1px solid #ede9e2" : "none" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f8f5f0"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold" style={{ color: "#1e1e1e" }}>
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-sm truncate max-w-xs" style={{ color: "#6b6560" }}>
                              {category.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm px-2 py-1 rounded" style={{ backgroundColor: "#f8f5f0", color: "#b8934a" }}>
                          {category.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium" style={{ color: "#1e1e1e" }}>
                          {category._count?.products || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm" style={{ color: "#6b6560" }}>
                          {category.sortOrder}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(category)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all"
                          style={{
                            backgroundColor: category.isActive ? "#10b981" : "#6b7280",
                            color: "white"
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                        >
                          {category.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {category.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                            style={{ color: "#b8934a" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f8f5f0"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.id, category.name, category._count?.products || 0)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                            style={{ color: "#dc2626" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fee2e2"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Count */}
        {categories.length > 0 && (
          <div className="mt-4 text-sm text-center" style={{ color: "#6b6560" }}>
            Total: {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} 
            ({categories.filter(c => c.isActive).length} active)
          </div>
        )}
      </div>
    </div>
  );
}
