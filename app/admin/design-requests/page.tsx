"use client";

import { useState, useEffect } from "react";
import { authenticatedFetch } from "@/lib/auth";
import { getApiUrl } from "@/lib/config";
import { Sparkles, Eye, Clock, MapPin, DollarSign } from "lucide-react";
import * as XLSX from 'xlsx';
import { useAdminExport } from "@/context/AdminExportContext";

interface DesignRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  projectType: string;
  budget: string | null;
  location: string | null;
  timeline: string | null;
  description: string;
  isRead: boolean;
  status: string;
  createdAt: string;
}

export default function DesignRequestsPage() {
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<DesignRequest | null>(null);
  const { registerExport, unregisterExport } = useAdminExport();

  const exportToExcel = () => {
    if (requests.length === 0) {
      alert('No design requests to export');
      return;
    }

    // Prepare data for export
    const exportData = requests.map(req => ({
      'Name': req.name,
      'Email': req.email,
      'Phone': req.phone || 'N/A',
      'Project Type': req.projectType,
      'Budget': req.budget || 'Not specified',
      'Location': req.location || 'Not specified',
      'Timeline': req.timeline || 'Not specified',
      'Description': req.description,
      'Status': req.status,
      'Read': req.isRead ? 'Yes' : 'No',
      'Date': new Date(req.createdAt).toLocaleString()
    }));

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Design Requests');

    // Generate file name with timestamp
    const fileName = `design_requests_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);
  };

  useEffect(() => {
    registerExport(exportToExcel, 'Export Design Requests');
    return () => unregisterExport();
  }, [requests, registerExport, unregisterExport]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await authenticatedFetch(getApiUrl('contact/design-requests'));
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch design requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await authenticatedFetch(getApiUrl(`contact/design-requests/${id}/read`), {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.success) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleViewRequest = (request: DesignRequest) => {
    setSelectedRequest(request);
    if (!request.isRead) {
      markAsRead(request.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading design requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Design Requests</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">View and manage interior design requests from customers</p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No design requests yet</h3>
            <p className="text-sm sm:text-base text-gray-600">Customer design requests will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Requests List */}
            <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-sm sm:text-base text-gray-900">Requests ({requests.length})</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                {requests.map((request) => (
                  <button
                    key={request.id}
                    onClick={() => handleViewRequest(request)}
                    className={`w-full text-left p-3 sm:p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                      selectedRequest?.id === request.id ? 'bg-amber-50' : ''
                    } ${!request.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">{request.name}</div>
                      {!request.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate mb-1">{request.projectType}</div>
                    <div className="text-xs text-gray-500 truncate">{request.location || 'No location'}</div>
                    <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Request Detail */}
            <div className="lg:col-span-2">
              {selectedRequest ? (
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{selectedRequest.projectType}</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div>
                        <div className="text-xs sm:text-sm text-gray-500 mb-1">Client</div>
                        <div className="font-medium text-sm sm:text-base text-gray-900">{selectedRequest.name}</div>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-gray-500 mb-1">Email</div>
                        <div className="font-medium text-sm sm:text-base text-gray-900 truncate">{selectedRequest.email}</div>
                      </div>
                      {selectedRequest.phone && (
                        <div>
                          <div className="text-xs sm:text-sm text-gray-500 mb-1">Phone</div>
                          <div className="font-medium text-sm sm:text-base text-gray-900">{selectedRequest.phone}</div>
                        </div>
                      )}
                      {selectedRequest.location && (
                        <div>
                          <div className="text-xs sm:text-sm text-gray-500 mb-1">Location</div>
                          <div className="font-medium text-sm sm:text-base text-gray-900 flex items-center gap-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            <span className="truncate">{selectedRequest.location}</span>
                          </div>
                        </div>
                      )}
                      {selectedRequest.budget && (
                        <div>
                          <div className="text-xs sm:text-sm text-gray-500 mb-1">Budget</div>
                          <div className="font-medium text-sm sm:text-base text-gray-900 flex items-center gap-1">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            {selectedRequest.budget}
                          </div>
                        </div>
                      )}
                      {selectedRequest.timeline && (
                        <div>
                          <div className="text-xs sm:text-sm text-gray-500 mb-1">Timeline</div>
                          <div className="font-medium text-sm sm:text-base text-gray-900">{selectedRequest.timeline}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs sm:text-sm text-gray-500 mb-1">Submitted</div>
                        <div className="font-medium text-xs sm:text-sm text-gray-900">{new Date(selectedRequest.createdAt).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-gray-500 mb-1">Status</div>
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 capitalize">
                          {selectedRequest.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 sm:pt-6">
                    <div className="text-xs sm:text-sm text-gray-500 mb-2">Project Description</div>
                    <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap">{selectedRequest.description}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
                  <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-gray-600">Select a request to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
