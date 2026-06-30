"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Users as UsersIcon } from "lucide-react";

interface Staff {
  id: string;
  username: string;
  email: string | null;
  role: string;
  createdAt: string;
}

export default function StaffPage() {
  const { token, isOwner } = useAdminAuth();
  const router = useRouter();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOwner) {
      router.push("/admin/dashboard");
      return;
    }
    fetchStaff();
  }, [isOwner, router]);

  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/staff', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStaff(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create staff');
      }

      setFormData({ username: "", password: "", email: "" });
      setShowCreateForm(false);
      fetchStaff();
      alert('Staff created successfully');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Delete staff member "${username}"?`)) return;

    try {
      const response = await fetch(`http://localhost:4000/api/auth/staff/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete staff');
      }

      fetchStaff();
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (!isOwner) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8f5f0" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: "#b8934a" }}></div>
          <p className="mt-4" style={{ color: "#6b6560" }}>Loading staff...</p>
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
              Staff Management
            </h1>
            <p className="text-base" style={{ color: "#6b6560" }}>
              Manage staff accounts and permissions
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-lg transition-all hover:shadow-lg"
            style={{ backgroundColor: "#b8934a", color: "white" }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Staff</span>
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg border p-6 mb-6" style={{ borderColor: "#ede9e2" }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: "#1e1e1e", fontFamily: "'Playfair Display', serif" }}>
              Create New Staff Account
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#6b6560" }}>
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{ border: "2px solid #ede9e2" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#6b6560" }}>
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{ border: "2px solid #ede9e2" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#6b6560" }}>
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{ border: "2px solid #ede9e2" }}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                  style={{ backgroundColor: "#b8934a", color: "white" }}
                >
                  {isSubmitting ? "Creating..." : "Create Staff"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ username: "", password: "", email: "" });
                  }}
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ border: "2px solid #ede9e2", color: "#6b6560" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Staff List */}
        {staff.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center" style={{ borderColor: "#ede9e2" }}>
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#f8f5f0" }}
            >
              <UsersIcon className="w-8 h-8" style={{ color: "#b8934a" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#1e1e1e", fontFamily: "'Playfair Display', serif" }}>
              No staff yet
            </h3>
            <p style={{ color: "#6b6560" }}>Create staff accounts to delegate tasks</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: "#ede9e2" }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#f8f5f0", borderBottom: "1px solid #ede9e2" }}>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560" }}>
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560" }}>
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560" }}>
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560" }}>
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member, idx) => (
                    <tr 
                      key={member.id}
                      style={{ borderBottom: idx < staff.length - 1 ? "1px solid #ede9e2" : "none" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f5f0"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold" style={{ color: "#1e1e1e" }}>
                          {member.username}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ color: "#6b6560" }}>
                          {member.email || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: "#f8f5f0", color: "#b8934a" }}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ color: "#6b6560" }}>
                          {new Date(member.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleDelete(member.id, member.username)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                            style={{ color: "#dc2626" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
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
      </div>
    </div>
  );
}
