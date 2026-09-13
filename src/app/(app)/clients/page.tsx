'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Users,
  Search,
  Phone,
  Ruler,
  ChevronRight,
  AlertCircle,
  Loader2,
  Trash2,
  Edit2,
  FileText,
} from 'lucide-react';
import { getClients, deleteClientAction } from './actions';

interface ClientItem {
  id: string;
  name: string;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [clientToDelete, setClientToDelete] = useState<ClientItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    setError(null);
    try {
      const res = await getClients();
      if (res.error) {
        setError(res.error);
      } else if (res.data) {
        setClients(res.data as ClientItem[]);
      }
    } catch {
      setError('Failed to load clients. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchClients() {
      try {
        const res = await getClients();
        if (ignore) return;
        if (res.error) {
          setError(res.error);
        } else if (res.data) {
          setClients(res.data as ClientItem[]);
        }
      } catch {
        if (!ignore) {
          setError('Failed to load clients. Please try again.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchClients();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    setIsDeleting(true);
    setDeleteErrorMessage(null);

    try {
      const res = await deleteClientAction(clientToDelete.id);
      if (res.error) {
        setDeleteErrorMessage(res.error);
      } else {
        setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
        setClientToDelete(null);
      }
    } catch {
      setDeleteErrorMessage('An error occurred while deleting the client.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery)) ||
    (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header & New Client CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-400" />
            Client Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your clients, contact details, and custom fitting profiles.
          </p>
        </div>

        <Link
          href="/clients/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-semibold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client name, phone number, or notes..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-950/50 border border-red-800 rounded-xl text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
          <div className="flex-1">
            <p>{error}</p>
            <button
              onClick={loadClients}
              className="text-xs text-red-400 underline hover:text-red-300 mt-1 cursor-pointer"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm">Loading client directory...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && clients.length === 0 && (
        <div className="p-8 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-200">No clients registered</h3>
            <p className="text-xs text-slate-400 mt-1">
              Add your first client to start taking measurements and building fitting history.
            </p>
          </div>
          <Link
            href="/clients/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add First Client
          </Link>
        </div>
      )}

      {/* Filtered No Results */}
      {!isLoading && !error && clients.length > 0 && filteredClients.length === 0 && (
        <div className="p-8 text-center text-slate-400">
          <p className="text-sm">No clients found matching &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-amber-400 hover:underline mt-1 cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Clients List */}
      {!isLoading && !error && filteredClients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-slate-700 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/clients/${client.id}`}
                    className="group-hover:text-amber-400 transition cursor-pointer"
                  >
                    <h3 className="font-semibold text-slate-100 text-base flex items-center gap-2">
                      <span>{client.name}</span>
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/clients/${client.id}/edit`}
                      title="Edit Client"
                      className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteErrorMessage(null);
                        setClientToDelete(client);
                      }}
                      title="Delete Client"
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact & Notes Snippet */}
                <div className="mt-2.5 space-y-1.5">
                  {client.phone ? (
                    <a
                      href={`tel:${client.phone}`}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-300 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400/80" />
                      <span>{client.phone}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500 italic">No phone number</span>
                  )}

                  {client.notes && (
                    <p className="text-xs text-slate-400 line-clamp-2 pt-0.5 flex items-start gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{client.notes}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  href={`/measurements/new?clientId=${client.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Take Measurement</span>
                </Link>

                <Link
                  href={`/clients/${client.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  <span>Profile & History</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-950/50 border border-red-800/80 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Delete Client?</h3>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to delete client{' '}
              <span className="font-semibold text-white">&ldquo;{clientToDelete.name}&rdquo;</span>?
            </p>

            {deleteErrorMessage && (
              <div className="p-3 bg-amber-950/50 border border-amber-800/80 rounded-xl text-xs text-amber-200 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  Cannot Delete Client
                </p>
                <p>{deleteErrorMessage}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setClientToDelete(null);
                  setDeleteErrorMessage(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition cursor-pointer"
              >
                Close
              </button>
              {!deleteErrorMessage && (
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Client'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
