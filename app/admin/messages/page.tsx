"use client";

import { useState, useEffect } from "react";
import { authenticatedFetch } from "@/lib/auth";
import { getApiUrl } from "@/lib/config";
import { Mail, Trash2, Eye, Clock } from "lucide-react";
import * as XLSX from 'xlsx';
import { useAdminExport } from "@/context/AdminExportContext";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { registerExport, unregisterExport } = useAdminExport();

  const exportToExcel = () => {
    if (messages.length === 0) {
      alert('No messages to export');
      return;
    }

    // Prepare data for export
    const exportData = messages.map(msg => ({
      'Name': msg.name,
      'Email': msg.email,
      'Phone': msg.phone || 'N/A',
      'Subject': msg.subject || 'No Subject',
      'Message': msg.message,
      'Status': msg.isRead ? 'Read' : 'Unread',
      'Date': new Date(msg.createdAt).toLocaleString()
    }));

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Messages');

    // Generate file name with timestamp
    const fileName = `messages_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);
  };

  useEffect(() => {
    registerExport(exportToExcel, 'Export Messages');
    return () => unregisterExport();
  }, [messages, registerExport, unregisterExport]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await authenticatedFetch(getApiUrl('contact/messages'));
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await authenticatedFetch(getApiUrl(`contact/messages/${id}/read`), {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.success) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete message from "${name}"?`)) return;

    try {
      const response = await authenticatedFetch(getApiUrl(`contact/messages/${id}`), {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setSelectedMessage(null);
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">View and respond to contact form submissions</p>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-sm sm:text-base text-gray-600">Customer messages will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-sm sm:text-base text-gray-900">Inbox ({messages.length})</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => handleViewMessage(message)}
                    className={`w-full text-left p-3 sm:p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-amber-50' : ''
                    } ${!message.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="font-semibold text-sm sm:text-base text-gray-900 truncate">{message.name}</div>
                      {!message.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate mb-1">{message.email}</div>
                    <div className="text-xs text-gray-500 truncate">{message.subject || message.message.substring(0, 50)}</div>
                    <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">{selectedMessage.subject || 'No Subject'}</h2>
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                        <div><span className="font-medium">From:</span> {selectedMessage.name}</div>
                        <div><span className="font-medium">Email:</span> {selectedMessage.email}</div>
                        {selectedMessage.phone && (
                          <div><span className="font-medium">Phone:</span> {selectedMessage.phone}</div>
                        )}
                        <div><span className="font-medium">Date:</span> {new Date(selectedMessage.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                      className="text-red-600 hover:bg-red-50 active:bg-red-100 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <div className="border-t border-gray-200 pt-4 sm:pt-6">
                    <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
                  <Mail className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-gray-600">Select a message to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
