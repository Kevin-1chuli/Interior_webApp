"use client";

import React, { useState, useEffect } from "react";
import { authenticatedFetch, getToken, isManager as checkIsManager } from "@/lib/auth";
import { getApiUrl } from "@/lib/config";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Users as UsersIcon, Key, Eye, EyeOff } from "lucide-react";
import * as XLSX from 'xlsx';
import { useAdminExport } from "@/context/AdminExportContext";

interface Staff {
  id: string;
  username: string;
  email: string | null;
  role: string;
  createdAt: string;
}

export default function StaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState<string | null>(null);
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({ newPassword: "", confirmPassword: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { registerExport, unregisterExport } = useAdminExport();

  const exportToExcel = () => {
    if (staff.length === 0) {
      alert('No staff to export');
      return;
    }

    const exportData = staff.map(member => ({
      'Username': member.username,
      'Email': member.email || 'N/A',
      'Role': member.role,
      'Date Created': new Date(member.createdAt).toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff');
    const fileName = `staff_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  useEffect(() => {
    if (!checkIsManager()) {
      router.push("/admin/dashboard");
      return;
    }
    registerExport(exportToExcel, 'Export Staff');
    return () => unregisterExport();
  }, [staff, router, registerExport, unregisterExport]);

  useEffect(() => {
    if (!checkIsManager()) {
      router.push("/admin/dashboard");
      return;
    }
    fetchStaff();
  }, [router]);

  const fetchStaff = async () => {
    try {
      const response = await authenticatedFetch(getApiUrl('auth/staff'));
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
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authenticatedFetch(getApiUrl('auth/staff'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create staff');
      }

      setFormData({ username: "", password: "", email: "" });
      setShowCreateForm(false);
      fetchStaff();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (staffId: string) => {
    setError("");
    
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (resetPasswordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authenticatedFetch(getApiUrl(`auth/staff/${staffId}/reset-password`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: resetPasswordData.newPassword })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setResetPasswordData({ newPassword: "", confirmPassword: "" });
      setShowResetPassword(null);
      alert(data.message || 'Password reset successfully');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Delete staff member "${username}"?`)) return;

    try {
      const response = await authenticatedFetch(getApiUrl(`auth/staff/${id}`), {
        method: 'DELETE'
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

  if (!checkIsManager()) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">Manage staff accounts and passwords</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Staff</span>
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Staff Account</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temporary Password *
                </label>
                <div className="relative">
                  <input
                    type={showCreatePassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Staff will be required to change this on first login"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCreatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Staff will be forced to change this password on first login</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Enter email"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Staff"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ username: "", password: "", email: "" });
                    setShowCreatePassword(false);
                    setError("");
                  }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Staff List */}
        {staff.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No staff yet</h3>
            <p className="text-gray-600">Create staff accounts to delegate tasks</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {staff.map((member) => (
                    <React.Fragment key={member.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{member.username}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">{member.email || '-'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {new Date(member.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setShowResetPassword(showResetPassword === member.id ? null : member.id);
                                setError("");
                                setResetPasswordData({ newPassword: "", confirmPassword: "" });
                                setShowNewPassword(false);
                                setShowConfirmPassword(false);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            >
                              <Key className="w-4 h-4" />
                              Reset
                            </button>
                            <button
                              onClick={() => handleDelete(member.id, member.username)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      {showResetPassword === member.id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-amber-50">
                            <div className="max-w-md">
                              <h4 className="font-semibold text-gray-900 mb-3">Reset Password for {member.username}</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                  </label>
                                  <div className="relative">
                                    <input
                                      type={showNewPassword ? "text" : "password"}
                                      value={resetPasswordData.newPassword}
                                      onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                      placeholder="Enter new password (min 6 characters)"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowNewPassword(!showNewPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                  </label>
                                  <div className="relative">
                                    <input
                                      type={showConfirmPassword ? "text" : "password"}
                                      value={resetPasswordData.confirmPassword}
                                      onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                      placeholder="Confirm new password"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  </div>
                                </div>
                                {error && (
                                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                    {error}
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleResetPassword(member.id)}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg font-medium transition-all disabled:opacity-50"
                                  >
                                    {isSubmitting ? "Resetting..." : "Reset Password"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowResetPassword(null);
                                      setError("");
                                      setResetPasswordData({ newPassword: "", confirmPassword: "" });
                                      setShowNewPassword(false);
                                      setShowConfirmPassword(false);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded-lg font-medium transition-all"
                                  >
                                    Cancel
                                  </button>
                                </div>
                                <p className="text-xs text-gray-600">Staff will be required to change this password on next login</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
