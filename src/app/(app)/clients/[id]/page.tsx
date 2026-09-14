'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Phone,
  FileText,
  Calendar,
  Ruler,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  Tag,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getClientProfile, deleteClientAction } from '../actions';

interface MeasurementSnapshotField {
  field_name: string;
  unit?: string | null;
  value: string;
}

interface MeasurementRecord {
  id: string;
  template_id: string | null;
  template_name_snapshot: string;
  fields_snapshot: MeasurementSnapshotField[];
  taken_at: string;
  created_at: string;
}

interface ClientData {
  id: string;
  name: string;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params?.id as string;

  const [client, setClient] = useState<ClientData | null>(null);
  const [measurements, setMeasurements] = useState<MeasurementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Expanded measurement cards
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchProfile() {
      if (!clientId) return;
      try {
        const res = await getClientProfile(clientId);
        if (ignore) return;
        if (res.error || !res.data) {
          setError(res.error || 'Client not found');
        } else {
          setClient(res.data.client);
          const fetchedMeasurements = (res.data.measurements || []) as unknown as MeasurementRecord[];
          setMeasurements(fetchedMeasurements);
          if (fetchedMeasurements.length > 0) {
            setExpandedId(fetchedMeasurements[0].id);
          }
        }
      } catch {
        if (!ignore) {
          setError('Failed to load client profile');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      ignore = true;
    };
  }, [clientId]);

  const handleDeleteClient = async () => {
    if (!client) return;
    setIsDeleting(true);
    setDeleteErrorMessage(null);

    try {
      const res = await deleteClientAction(client.id);
      if (res.error) {
        setDeleteErrorMessage(res.error);
      } else {
        router.push('/clients');
        router.refresh();
      }
    } catch {
      setDeleteErrorMessage('An error occurred while deleting the client.');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-medium pr-1">Client Directory</span>
        </Link>

        {client && (
          <div className="flex items-center gap-2">
            <Link
              href={`/clients/${client.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Info</span>
            </Link>
            <button
              onClick={() => {
                setDeleteErrorMessage(null);
                setShowDeleteModal(true);
              }}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition cursor-pointer"
              title="Delete Client"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
          <p className="text-sm">Loading client profile...</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-950/50 border border-red-800 rounded-xl text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
          <div>
            <p>{error}</p>
            <Link
              href="/clients"
              className="text-xs text-red-400 underline hover:text-red-300 mt-1 inline-block"
            >
              Back to Client Directory
            </Link>
          </div>
        </div>
      )}

      {!isLoading && !error && client && (
        <>
          {/* Client Profile Card */}
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-lime-400/10 text-lime-400 border border-lime-400/20 rounded-2xl flex items-center justify-center font-bold text-lg">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
                      {client.name}
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Client since {new Date(client.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Contact & Notes */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {client.phone ? (
                    <a
                      href={`tel:${client.phone}`}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-lime-400 hover:text-lime-300 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{client.phone}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500 italic">No phone on file</span>
                  )}
                </div>

                {client.notes && (
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs text-slate-300 space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-lime-400" />
                      Fitting Preferences & Notes:
                    </p>
                    <p className="text-slate-300 whitespace-pre-wrap">{client.notes}</p>
                  </div>
                )}
              </div>

              {/* Action: Take Measurement */}
              <Link
                href={`/measurements/new?clientId=${client.id}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-lime-400 hover:bg-lime-300 active:scale-95 text-brand-900 font-semibold rounded-xl text-sm shadow-lg shadow-lime-400/20 transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New Measurement</span>
              </Link>
            </div>
          </div>

          {/* Measurements History Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-lime-400" />
                  Measurement History ({measurements.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Historical records are immutable snapshots taken during fittings.
                </p>
              </div>

              {measurements.length > 0 && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print History</span>
                </button>
              )}
            </div>

            {/* Empty History */}
            {measurements.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl space-y-3">
                  <div className="w-10 h-10 bg-lime-400/10 text-lime-400 rounded-xl flex items-center justify-center mx-auto">
                  <Ruler className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">
                  No measurements recorded yet
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Record measurements using any garment template to start building this client&apos;s fitting history.
                </p>
                <Link
                  href={`/measurements/new?clientId=${client.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-lime-400 hover:bg-lime-300 text-brand-900 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Take First Measurement
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {measurements.map((measurement, index) => {
                  const isExpanded = expandedId === measurement.id;
                  const takenDate = new Date(measurement.taken_at);

                  return (
                    <div
                      key={measurement.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition hover:border-slate-700"
                    >
                      {/* Card Header */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(measurement.id)}
                        className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-800/30 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-950 border border-slate-800 text-lime-400 rounded-xl">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-100 text-sm sm:text-base">
                                {measurement.template_name_snapshot}
                              </h3>
                              {index === 0 && (
                                <span className="px-2 py-0.5 bg-lime-400/10 border border-lime-400/30 text-lime-300 text-[10px] font-semibold rounded-full">
                                  Latest
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-500" />
                              Recorded on {takenDate.toLocaleDateString()} at{' '}
                              {takenDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 hidden sm:inline">
                            {measurement.fields_snapshot?.length || 0} fields
                          </span>
                          <div className="p-1 text-slate-400">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Card Body - Fields Snapshot Table */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-800/80">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-3">
                            {measurement.fields_snapshot &&
                            measurement.fields_snapshot.length > 0 ? (
                              measurement.fields_snapshot.map((field, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl"
                                >
                                  <p className="text-[11px] font-medium text-slate-400 truncate">
                                    {field.field_name}
                                  </p>
                                  <p className="text-base font-bold text-slate-100 mt-1 flex items-baseline gap-1">
                                    <span>{field.value}</span>
                                    {field.unit && (
                                      <span className="text-xs font-normal text-lime-400/90">
                                        {field.unit}
                                      </span>
                                    )}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-500 col-span-full">
                                No field values recorded.
                              </p>
                            )}
                          </div>

                          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                            <span>Snapshot ID: {measurement.id.slice(0, 8)}</span>
                            <span className="italic">Immutable historical snapshot</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && client && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-950/50 border border-red-800/80 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Delete Client?</h3>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-white">&ldquo;{client.name}&rdquo;</span>?
            </p>

            {deleteErrorMessage && (
              <div className="p-3 bg-brand-950/50 border border-brand-800/80 rounded-xl text-xs text-lime-200 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-lime-400 shrink-0" />
                  Cannot Delete Client
                </p>
                <p>{deleteErrorMessage}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
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
                  onClick={handleDeleteClient}
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
