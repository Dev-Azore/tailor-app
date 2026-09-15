'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Ruler,
  Search,
  Check,
  Calendar,
  Layers,
  ChevronRight,
  AlertCircle,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Clock,
  Sparkles,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import {
  getMeasurementWizardData,
  recordMeasurement,
  ClientOption,
  TemplateOption,
} from '../actions';

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'CL';
}

function MeasurementWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const preselectedClientId = searchParams.get('clientId');
  const preselectedTemplateId = searchParams.get('templateId');

  // Wizard state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Data lists
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);

  // Step 1 Selections
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');

  // Step 2 Form Values
  const [takenAt, setTakenAt] = useState<string>(() => {
    const now = new Date();
    const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    return localIso;
  });
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  // Step 3 Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const res = await getMeasurementWizardData();
        if (!isMounted) return;

        if (res.error) {
          setLoadError(res.error);
        } else {
          setClients(res.clients);
          setTemplates(res.templates);

          // Apply pre-selections if provided via query params
          let initialClientId = '';
          let initialTemplateId = '';

          if (preselectedClientId && res.clients.some((c) => c.id === preselectedClientId)) {
            initialClientId = preselectedClientId;
            setSelectedClientId(preselectedClientId);
          }

          if (preselectedTemplateId && res.templates.some((t) => t.id === preselectedTemplateId)) {
            initialTemplateId = preselectedTemplateId;
            setSelectedTemplateId(preselectedTemplateId);
          }

          // If both were pre-selected, auto-advance to step 2
          if (initialClientId && initialTemplateId) {
            setCurrentStep(2);
          }
        }
      } catch {
        if (isMounted) {
          setLoadError('Failed to load clients and templates. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [preselectedClientId, preselectedTemplateId]);

  // Active selections
  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) || null,
    [clients, selectedClientId]
  );

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) || null,
    [templates, selectedTemplateId]
  );

  // Initialize field values when a template is selected
  useEffect(() => {
    if (selectedTemplate) {
      setFieldValues((prev) => {
        const next: Record<string, string> = {};
        for (const field of selectedTemplate.template_fields) {
          next[field.field_name] = prev[field.field_name] || '';
        }
        return next;
      });
    }
  }, [selectedTemplate]);

  // Filtered clients for search
  const filteredClients = useMemo(() => {
    const q = clientSearchQuery.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q))
    );
  }, [clients, clientSearchQuery]);

  const handleFieldValueChange = (fieldName: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const hasAtLeastOneFieldFilled = useMemo(() => {
    return Object.values(fieldValues).some((v) => v && v.trim().length > 0);
  }, [fieldValues]);

  const handleStep1Next = () => {
    if (selectedClientId && selectedTemplateId) {
      setSubmitError(null);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStep2Next = () => {
    if (!hasAtLeastOneFieldFilled) {
      setSubmitError('Please enter at least one measurement value to continue.');
      return;
    }
    setSubmitError(null);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveMeasurement = async () => {
    if (!selectedClientId || !selectedTemplateId || !selectedTemplate) {
      setSubmitError('Client or template selection is missing.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formattedFieldValues = selectedTemplate.template_fields.map((tf) => ({
        field_name: tf.field_name,
        unit: tf.unit,
        value: (fieldValues[tf.field_name] || '').trim(),
      }));

      const res = await recordMeasurement({
        client_id: selectedClientId,
        template_id: selectedTemplateId,
        taken_at: takenAt ? new Date(takenAt).toISOString() : new Date().toISOString(),
        field_values: formattedFieldValues,
      });

      if (res.error) {
        setSubmitError(res.error);
        setIsSubmitting(false);
      } else {
        router.push(`/clients/${selectedClientId}`);
        router.refresh();
      }
    } catch {
      setSubmitError('A network error occurred while saving the measurement. Please retry.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-4 max-w-xl mx-auto">
        <Loader2 className="w-10 h-10 animate-spin text-[#81c784]" />
        <p className="text-sm font-medium">Loading measurement studio...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-xl mx-auto space-y-4 py-8">
        <div className="p-4 bg-red-950/60 border border-red-800 rounded-2xl flex items-start gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-medium">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-100 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12 animate-fade-in-up">
      {/* Top Navigation & Stepper Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href={selectedClientId ? `/clients/${selectedClientId}` : '/dashboard'}
            className="inline-flex items-center gap-2 p-2 bg-[#071A34] border border-[#0B2545] hover:border-[#2e7d32]/50 text-slate-400 hover:text-white rounded-xl transition cursor-pointer text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{selectedClientId ? 'Back to Client' : 'Dashboard'}</span>
          </Link>

          <span className="text-xs font-bold px-3 py-1 bg-[#2e7d32]/20 border border-[#2e7d32]/35 text-[#81c784] rounded-full">
            Step {currentStep} of 3
          </span>
        </div>

        {/* Wizard Stepper Progress Bar */}
        <div className="bg-[#071A34] border border-[#0B2545] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between relative">
            {/* Step 1 Pill */}
            <div
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 text-xs font-bold transition cursor-pointer ${
                currentStep >= 1 ? 'text-[#81c784]' : 'text-slate-500'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${
                  currentStep > 1
                    ? 'bg-[#2e7d32] text-white border-[#2e7d32]'
                    : currentStep === 1
                    ? 'bg-[#2e7d32]/20 text-[#81c784] border-[#2e7d32]'
                    : 'bg-[#040e1e] text-slate-600 border-[#0B2545]'
                }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className="hidden sm:inline">Select Client & Style</span>
            </div>

            <div
              className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors ${
                currentStep >= 2 ? 'bg-[#2e7d32]' : 'bg-[#0B2545]'
              }`}
            />

            {/* Step 2 Pill */}
            <div
              onClick={() => {
                if (selectedClientId && selectedTemplateId) setCurrentStep(2);
              }}
              className={`flex items-center gap-2 text-xs font-bold transition ${
                selectedClientId && selectedTemplateId
                  ? 'cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              } ${currentStep >= 2 ? 'text-[#81c784]' : 'text-slate-500'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${
                  currentStep > 2
                    ? 'bg-[#2e7d32] text-white border-[#2e7d32]'
                    : currentStep === 2
                    ? 'bg-[#2e7d32]/20 text-[#81c784] border-[#2e7d32]'
                    : 'bg-[#040e1e] text-slate-600 border-[#0B2545]'
                }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className="hidden sm:inline">Enter Measurements</span>
            </div>

            <div
              className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors ${
                currentStep === 3 ? 'bg-[#2e7d32]' : 'bg-[#0B2545]'
              }`}
            />

            {/* Step 3 Pill */}
            <div
              onClick={() => {
                if (selectedClientId && selectedTemplateId && hasAtLeastOneFieldFilled) {
                  setCurrentStep(3);
                }
              }}
              className={`flex items-center gap-2 text-xs font-bold transition ${
                selectedClientId && selectedTemplateId && hasAtLeastOneFieldFilled
                  ? 'cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              } ${currentStep === 3 ? 'text-[#81c784]' : 'text-slate-500'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${
                  currentStep === 3
                    ? 'bg-[#2e7d32]/20 text-[#81c784] border-[#2e7d32]'
                    : 'bg-[#040e1e] text-slate-600 border-[#0B2545]'
                }`}
              >
                3
              </div>
              <span className="hidden sm:inline">Review & Save</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit/Validation Error */}
      {submitError && (
        <div className="p-4 bg-red-950/40 border border-red-800 rounded-2xl flex items-start gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">{submitError}</div>
        </div>
      )}

      {/* STEP 1: SELECT CLIENT & TEMPLATE */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Section 1: Choose Client */}
          <div className="bg-[#071A34] border border-[#0B2545] rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2e7d32]/20 text-[#81c784] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">1. Select Customer</h2>
                  <p className="text-xs text-slate-400">Who are you fitting today?</p>
                </div>
              </div>

              <Link
                href="/clients/new"
                className="inline-flex items-center gap-1.5 text-xs text-[#81c784] hover:underline font-bold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Customer</span>
              </Link>
            </div>

            {/* Client Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
                placeholder="Search customer by name or phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#040e1e] border border-[#0B2545] focus:border-[#2e7d32] rounded-xl text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            {/* Client List */}
            {clients.length === 0 ? (
              <div className="p-6 text-center bg-[#040e1e] border border-dashed border-[#0B2545] rounded-2xl space-y-3">
                <p className="text-sm text-slate-400">No customers registered yet.</p>
                <Link
                  href="/clients/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold rounded-xl text-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Customer</span>
                </Link>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-[#040e1e] rounded-xl">
                No customers matching &ldquo;{clientSearchQuery}&rdquo;
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {filteredClients.map((client) => {
                  const isSelected = selectedClientId === client.id;
                  return (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => {
                        setSelectedClientId(client.id);
                        setSubmitError(null);
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#2e7d32]/15 border-[#2e7d32] text-white shadow-sm shadow-[#2e7d32]/10'
                          : 'bg-[#040e1e] border-[#0B2545] hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                            isSelected
                              ? 'bg-[#2e7d32] text-white'
                              : 'bg-[#071A34] text-[#81c784] border border-[#0B2545]'
                          }`}
                        >
                          {getInitials(client.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate text-white">
                            {client.name}
                          </p>
                          {client.phone && (
                            <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#2e7d32]" />
                              {client.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#2e7d32] text-white flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Choose Template */}
          <div className="bg-[#071A34] border border-[#0B2545] rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2e7d32]/20 text-[#81c784] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">2. Select Garment Template</h2>
                  <p className="text-xs text-slate-400">
                    Which garment style are you recording measurements for?
                  </p>
                </div>
              </div>

              <Link
                href="/templates/new"
                className="inline-flex items-center gap-1.5 text-xs text-[#81c784] hover:underline font-bold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Template</span>
              </Link>
            </div>

            {/* Template List */}
            {templates.length === 0 ? (
              <div className="p-6 text-center bg-[#040e1e] border border-dashed border-[#0B2545] rounded-2xl space-y-3">
                <p className="text-sm text-slate-400">No measurement templates created yet.</p>
                <Link
                  href="/templates/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold rounded-xl text-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Template</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {templates.map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(tpl.id);
                        setSubmitError(null);
                      }}
                      className={`flex flex-col p-3.5 rounded-xl border text-left transition cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-[#2e7d32]/15 border-[#2e7d32] text-white shadow-sm shadow-[#2e7d32]/10'
                          : 'bg-[#040e1e] border-[#0B2545] hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">
                          {tpl.name}
                        </span>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[#2e7d32] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 bg-[#071A34] border border-[#0B2545] text-[#81c784] rounded-full font-medium">
                            {tpl.template_fields.length} {tpl.template_fields.length === 1 ? 'point' : 'points'}
                          </span>
                        )}
                      </div>

                      {/* Field Tags Preview */}
                      <div className="flex flex-wrap gap-1">
                        {tpl.template_fields.slice(0, 4).map((f) => (
                          <span
                            key={f.id}
                            className="text-[10px] px-1.5 py-0.5 bg-[#071A34] text-slate-300 rounded-md border border-[#0B2545]"
                          >
                            {f.field_name}
                          </span>
                        ))}
                        {tpl.template_fields.length > 4 && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            +{tpl.template_fields.length - 4} more
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              disabled={!selectedClientId || !selectedTemplateId}
              onClick={handleStep1Next}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition cursor-pointer ${
                selectedClientId && selectedTemplateId
                  ? 'bg-[#2e7d32] hover:bg-[#1b5e20] text-white shadow-lg shadow-[#2e7d32]/25 active:scale-95'
                  : 'bg-[#071A34] text-slate-500 border border-[#0B2545] cursor-not-allowed'
              }`}
            >
              <span>Next: Enter Values</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ENTER MEASUREMENT VALUES */}
      {currentStep === 2 && selectedTemplate && selectedClient && (
        <div className="space-y-6">
          {/* Active Context Banner */}
          <div className="p-4 bg-[#071A34] border border-[#0B2545] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#040e1e] text-[#81c784] border border-[#2e7d32]/40 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                {getInitials(selectedClient.name)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{selectedClient.name}</p>
                  <span className="text-slate-600">•</span>
                  <p className="text-xs font-bold text-[#81c784]">{selectedTemplate.name}</p>
                </div>
                <p className="text-xs text-slate-400">
                  {selectedTemplate.template_fields.length} measurement points to record
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-slate-400 hover:text-white underline font-medium self-start sm:self-auto cursor-pointer"
            >
              Change customer or style
            </button>
          </div>

          {/* Date & Time Taken Input */}
          <div className="p-4 sm:p-5 bg-[#071A34] border border-[#0B2545] rounded-2xl space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>Fitting Date & Time</span>
            </label>
            <input
              type="datetime-local"
              value={takenAt}
              onChange={(e) => setTakenAt(e.target.value)}
              className="w-full sm:w-72 px-3.5 py-2.5 bg-[#040e1e] border border-[#0B2545] focus:border-[#2e7d32] rounded-xl text-xs sm:text-sm text-white outline-none transition font-medium"
            />
          </div>

          {/* Field Inputs Grid */}
          <div className="bg-[#071A34] border border-[#0B2545] rounded-3xl p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#81c784]" />
                <span>Body Measurements</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Enter size values in Inches or Centimeters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {selectedTemplate.template_fields.map((field, idx) => {
                const val = fieldValues[field.field_name] || '';
                return (
                  <div
                    key={field.id}
                    className="p-3.5 bg-[#040e1e] border border-[#0B2545] focus-within:border-[#2e7d32] rounded-2xl space-y-1.5 transition"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <span className="text-[10px] text-[#81c784] font-mono">#{idx + 1}</span>
                        <span>{field.field_name}</span>
                      </label>
                      {field.unit && (
                        <span className="text-[11px] font-bold text-[#81c784] px-2 py-0.5 bg-[#071A34] border border-[#0B2545] rounded-md">
                          {field.unit}
                        </span>
                      )}
                    </div>

                    <div className="relative flex items-center">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={val}
                        onChange={(e) =>
                          handleFieldValueChange(field.field_name, e.target.value)
                        }
                        placeholder={field.unit ? `e.g. 40.5` : 'e.g. 40.5'}
                        className="w-full text-base sm:text-lg font-mono font-bold py-2 px-3 bg-transparent border-0 text-white placeholder-slate-600 outline-none"
                      />
                      {val && (
                        <button
                          type="button"
                          onClick={() => handleFieldValueChange(field.field_name, '')}
                          className="text-xs text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                          title="Clear field"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#071A34] hover:bg-[#0B2545] border border-[#0B2545] text-slate-300 font-medium rounded-xl text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Selection</span>
            </button>

            <button
              type="button"
              onClick={handleStep2Next}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2e7d32] hover:bg-[#1b5e20] active:scale-95 text-white font-bold rounded-xl text-sm shadow-lg shadow-[#2e7d32]/25 transition cursor-pointer"
            >
              <span>Review Measurement</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & IMMUTABLE SAVE */}
      {currentStep === 3 && selectedTemplate && selectedClient && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-[#071A34] border border-[#0B2545] rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2e7d32]/20 text-[#81c784] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  3. Review & Freeze Fitting Ticket
                </h2>
                <p className="text-xs text-slate-400">
                  Please verify all points before saving the permanent snapshot.
                </p>
              </div>
            </div>

            {/* Context Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-[#040e1e] border border-[#0B2545] rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#81c784]" />
                  Customer
                </p>
                <p className="text-sm font-bold text-white truncate">
                  {selectedClient.name}
                </p>
                {selectedClient.phone && (
                  <p className="text-xs text-slate-400">{selectedClient.phone}</p>
                )}
              </div>

              <div className="p-3.5 bg-[#040e1e] border border-[#0B2545] rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#81c784]" />
                  Style
                </p>
                <p className="text-sm font-bold text-white truncate">
                  {selectedTemplate.name}
                </p>
                <p className="text-xs text-slate-400">
                  {selectedTemplate.template_fields.length} points defined
                </p>
              </div>

              <div className="p-3.5 bg-[#040e1e] border border-[#0B2545] rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#81c784]" />
                  Session Date
                </p>
                <p className="text-sm font-bold text-white truncate">
                  {takenAt ? new Date(takenAt).toLocaleDateString('en-GB') : 'Now'}
                </p>
                <p className="text-xs text-slate-400">
                  {takenAt ? new Date(takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Measurements Table Review */}
          <div className="bg-[#071A34] border border-[#0B2545] rounded-3xl p-5 sm:p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recorded Field Values (Snapshot Preview)
            </h3>

            <div className="divide-y divide-[#0B2545] border border-[#0B2545] rounded-2xl overflow-hidden bg-[#040e1e]">
              {selectedTemplate.template_fields.map((tf, index) => {
                const val = fieldValues[tf.field_name] || '';
                const hasValue = val.trim().length > 0;
                return (
                  <div
                    key={tf.id}
                    className="flex items-center justify-between p-3.5 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500 w-5">
                        {index + 1}.
                      </span>
                      <span className="font-bold text-white">{tf.field_name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasValue ? (
                        <div className="flex items-center gap-1.5 font-mono font-black text-[#81c784] bg-[#2e7d32]/15 px-3 py-1 rounded-lg border border-[#2e7d32]/35">
                          <span>{val}</span>
                          {tf.unit && (
                            <span className="text-xs font-normal text-[#81c784]">
                              {tf.unit}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600 italic text-xs">Not recorded</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Immutability & Snapshot Notice */}
          <div className="p-4 bg-[#071A34] border border-[#0B2545] rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#81c784] shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Permanent Historical Snapshot:</strong> Saving this
              record creates a permanent snapshot in <strong className="text-white">{selectedClient.name}</strong>&rsquo;s
              fitting history. It will preserve these exact measurements forever with zero chance of loss.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#071A34] hover:bg-[#0B2545] border border-[#0B2545] text-slate-300 font-medium rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Edit Values</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSaveMeasurement}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2e7d32] hover:bg-[#1b5e20] active:scale-95 text-white font-bold rounded-xl text-sm shadow-xl shadow-[#2e7d32]/30 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving Snapshot...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save & Freeze Measurement</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MeasurementNewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-4 max-w-xl mx-auto">
          <Loader2 className="w-10 h-10 animate-spin text-[#81c784]" />
          <p className="text-sm font-medium">Loading measurement wizard...</p>
        </div>
      }
    >
      <MeasurementWizard />
    </Suspense>
  );
}
