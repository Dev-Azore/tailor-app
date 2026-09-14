'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Ruler,
  Search,
  Edit2,
  Trash2,
  Layers,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { getTemplates, deleteTemplate } from './actions';

interface TemplateItem {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  template_fields: {
    id: string;
    field_name: string;
    unit: string | null;
    order_index: number;
  }[];
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [templateToDelete, setTemplateToDelete] = useState<TemplateItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTemplates = useCallback(async () => {
    setError(null);
    try {
      const res = await getTemplates();
      if (res.error) {
        setError(res.error);
      } else if (res.data) {
        setTemplates(res.data as TemplateItem[]);
      }
    } catch {
      setError('Failed to load templates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchTemplates() {
      try {
        const res = await getTemplates();
        if (ignore) return;
        if (res.error) {
          setError(res.error);
        } else if (res.data) {
          setTemplates(res.data as TemplateItem[]);
        }
      } catch {
        if (!ignore) {
          setError('Failed to load templates. Please try again.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchTemplates();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteTemplate(templateToDelete.id);
      if (res.error) {
        alert(res.error);
      } else {
        setTemplates((prev) => prev.filter((t) => t.id !== templateToDelete.id));
        setTemplateToDelete(null);
      }
    } catch {
      alert('Failed to delete template. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.template_fields.some((f) =>
      f.field_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <Ruler className="w-6 h-6 text-lime-400" />
            Measurement Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Create and organize custom garment templates for quick measurement capture.
          </p>
        </div>

        <Link
          href="/templates/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-lime-400 hover:bg-lime-300 active:scale-95 text-brand-900 font-semibold rounded-xl text-sm shadow-lg shadow-lime-400/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates or measurement fields..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-950/50 border border-red-800 rounded-xl text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
          <div className="flex-1">
            <p>{error}</p>
            <button
              onClick={loadTemplates}
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
          <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
          <p className="text-sm">Loading your templates...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && templates.length === 0 && (
        <div className="p-8 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-lime-400/10 text-lime-400 rounded-2xl flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-200">No templates yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Templates save time during fittings by pre-defining the measurements needed for each garment type (e.g. Shirts, Trousers, Dresses).
            </p>
          </div>
          <Link
            href="/templates/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-lime-400 hover:bg-lime-300 text-brand-900 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Your First Template
          </Link>
        </div>
      )}

      {/* Filtered No Results */}
      {!isLoading && !error && templates.length > 0 && filteredTemplates.length === 0 && (
        <div className="p-8 text-center text-slate-400">
          <p className="text-sm">No templates found matching &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-lime-400 hover:underline mt-1 cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Templates Grid */}
      {!isLoading && !error && filteredTemplates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-slate-700 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-100 text-base group-hover:text-lime-400 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {template.template_fields.length} measurement {template.template_fields.length === 1 ? 'field' : 'fields'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/templates/${template.id}/edit`}
                      title="Edit Template"
                      className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setTemplateToDelete(template)}
                      title="Delete Template"
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Field Tags Preview */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {template.template_fields.slice(0, 6).map((field) => (
                    <span
                      key={field.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700/50"
                    >
                      {field.field_name}
                      {field.unit && (
                        <span className="text-slate-500 ml-1">({field.unit})</span>
                      )}
                    </span>
                  ))}
                  {template.template_fields.length > 6 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800/60 text-[11px] font-medium text-slate-500">
                      +{template.template_fields.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Quick-Action Link */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Updated {new Date(template.updated_at).toLocaleDateString()}
                </span>
                <Link
                  href={`/measurements/new?templateId=${template.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-lime-400 hover:text-lime-300 transition cursor-pointer"
                >
                  <span>Take Measurement</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {templateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-950/50 border border-red-800/80 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Delete Template?</h3>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to delete the template{' '}
              <span className="font-semibold text-white">&ldquo;{templateToDelete.name}&rdquo;</span>?
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Historical measurements are safe:</strong> All past client measurements recorded with this template will remain completely intact and unchanged.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTemplateToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition cursor-pointer"
              >
                Cancel
              </button>
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
                  'Delete Template'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
