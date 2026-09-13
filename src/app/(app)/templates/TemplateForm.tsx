'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Loader2,
  AlertCircle,
  Save,
  Layers,
} from 'lucide-react';
import { createTemplate, updateTemplate } from './actions';
import { TemplateFieldInput } from '@/lib/validation/template';

// Curated preset templates to speed up mobile entry
const PRESETS = [
  {
    name: 'Men’s Shirt',
    fields: [
      { field_name: 'Neck / Collar', unit: 'in' },
      { field_name: 'Chest / Bust', unit: 'in' },
      { field_name: 'Shoulder Width', unit: 'in' },
      { field_name: 'Sleeve Length', unit: 'in' },
      { field_name: 'Bicep / Arm', unit: 'in' },
      { field_name: 'Shirt Length', unit: 'in' },
      { field_name: 'Wrist / Cuff', unit: 'in' },
    ],
  },
  {
    name: 'Trousers / Pants',
    fields: [
      { field_name: 'Waist', unit: 'in' },
      { field_name: 'Hip', unit: 'in' },
      { field_name: 'Thigh Circumference', unit: 'in' },
      { field_name: 'Knee', unit: 'in' },
      { field_name: 'Inseam Length', unit: 'in' },
      { field_name: 'Outseam / Total Length', unit: 'in' },
      { field_name: 'Ankle / Bottom Opening', unit: 'in' },
    ],
  },
  {
    name: 'Traditional / Kaftan / Agbada',
    fields: [
      { field_name: 'Chest', unit: 'in' },
      { field_name: 'Top Length', unit: 'in' },
      { field_name: 'Shoulder', unit: 'in' },
      { field_name: 'Sleeve Length', unit: 'in' },
      { field_name: 'Neck', unit: 'in' },
      { field_name: 'Trouser Waist', unit: 'in' },
      { field_name: 'Trouser Length', unit: 'in' },
      { field_name: 'Trouser Thigh', unit: 'in' },
      { field_name: 'Ankle Width', unit: 'in' },
    ],
  },
  {
    name: 'Women’s Dress / Gown',
    fields: [
      { field_name: 'Bust', unit: 'in' },
      { field_name: 'Underbust', unit: 'in' },
      { field_name: 'Waist', unit: 'in' },
      { field_name: 'Hip', unit: 'in' },
      { field_name: 'Shoulder to Waist', unit: 'in' },
      { field_name: 'Shoulder to Floor / Length', unit: 'in' },
      { field_name: 'Sleeve Length', unit: 'in' },
    ],
  },
];

interface TemplateFormProps {
  initialData?: {
    id: string;
    name: string;
    template_fields: {
      id?: string;
      field_name: string;
      unit: string | null;
      order_index: number;
    }[];
  };
}

export function TemplateForm({ initialData }: TemplateFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || '');
  const [fields, setFields] = useState<TemplateFieldInput[]>(
    initialData?.template_fields && initialData.template_fields.length > 0
      ? initialData.template_fields.map((f, idx) => ({
          id: f.id,
          field_name: f.field_name,
          unit: f.unit || 'in',
          order_index: idx,
        }))
      : [
          { field_name: 'Chest / Bust', unit: 'in', order_index: 0 },
          { field_name: 'Waist', unit: 'in', order_index: 1 },
          { field_name: 'Length', unit: 'in', order_index: 2 },
        ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      { field_name: '', unit: 'in', order_index: prev.length },
    ]);
  };

  const handleRemoveField = (index: number) => {
    if (fields.length <= 1) {
      setGeneralError('A template must contain at least one measurement field.');
      return;
    }
    setGeneralError(null);
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    key: 'field_name' | 'unit',
    value: string
  ) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [key]: value } : f))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFields((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === fields.length - 1) return;
    setFields((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    if (name.trim() === '') {
      setName(preset.name);
    }
    setFields(
      preset.fields.map((f, idx) => ({
        field_name: f.field_name,
        unit: f.unit,
        order_index: idx,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    // Client-side quick check
    if (!name.trim()) {
      setFieldErrors({ name: ['Template name is required'] });
      return;
    }

    const emptyFieldIndex = fields.findIndex((f) => !f.field_name.trim());
    if (emptyFieldIndex !== -1) {
      setGeneralError(`Field #${emptyFieldIndex + 1} is missing a name.`);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && initialData) {
        const res = await updateTemplate({
          id: initialData.id,
          name: name.trim(),
          fields: fields.map((f, idx) => ({
            ...f,
            field_name: f.field_name.trim(),
            order_index: idx,
          })),
        });

        if (res.error) {
          setGeneralError(res.error);
          if (res.fieldErrors) setFieldErrors(res.fieldErrors);
          setIsSubmitting(false);
          return;
        }

        router.push('/templates');
        router.refresh();
      } else {
        const res = await createTemplate({
          name: name.trim(),
          fields: fields.map((f, idx) => ({
            ...f,
            field_name: f.field_name.trim(),
            order_index: idx,
          })),
        });

        if (res.error) {
          setGeneralError(res.error);
          if (res.fieldErrors) setFieldErrors(res.fieldErrors);
          setIsSubmitting(false);
          return;
        }

        router.push('/templates');
        router.refresh();
      }
    } catch {
      setGeneralError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {generalError && (
        <div className="flex items-start gap-3 p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Preset Quick Loader */}
      {!isEditing && (
        <div className="p-4 bg-slate-900/90 border border-slate-800/80 rounded-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Start Templates</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700/60 rounded-lg text-xs font-medium text-slate-200 transition-all cursor-pointer"
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Template Name Input */}
      <div className="p-4 sm:p-5 bg-slate-900/90 border border-slate-800/80 rounded-2xl space-y-2">
        <label
          htmlFor="template-name"
          className="block text-sm font-medium text-slate-200"
        >
          Template Name <span className="text-amber-400">*</span>
        </label>
        <input
          id="template-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Men’s 3-Piece Suit, Kaftan, Evening Gown"
          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-base"
          disabled={isSubmitting}
        />
        {fieldErrors.name && (
          <p className="text-xs text-red-400">{fieldErrors.name[0]}</p>
        )}
      </div>

      {/* Measurement Fields */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Measurement Fields ({fields.length})
            </h2>
            <p className="text-xs text-slate-400">
              Define the measurements taken for this garment
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddField}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Field
          </button>
        </div>

        <div className="space-y-2.5">
          {fields.map((field, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-2 sm:gap-3 transition-colors hover:border-slate-700"
            >
              {/* Order Number & Reorder */}
              <div className="flex flex-col items-center gap-0.5 text-slate-500">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || isSubmitting}
                  title="Move up"
                  className="p-1 hover:text-slate-200 disabled:opacity-20 disabled:hover:text-slate-500 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === fields.length - 1 || isSubmitting}
                  title="Move down"
                  className="p-1 hover:text-slate-200 disabled:opacity-20 disabled:hover:text-slate-500 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Field Name Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={field.field_name}
                  onChange={(e) =>
                    handleFieldChange(index, 'field_name', e.target.value)
                  }
                  placeholder={`Field name (e.g., Chest, Waist)`}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  disabled={isSubmitting}
                />
              </div>

              {/* Unit Selector */}
              <div className="w-24 sm:w-28 shrink-0">
                <select
                  value={field.unit || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'unit', e.target.value)
                  }
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  disabled={isSubmitting}
                >
                  <option value="in">Inches (in)</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="m">Meters (m)</option>
                  <option value="yd">Yards (yd)</option>
                  <option value="">No unit</option>
                </select>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleRemoveField(index)}
                disabled={fields.length <= 1 || isSubmitting}
                title="Remove field"
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition disabled:opacity-20 disabled:hover:text-slate-500 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddField}
          disabled={isSubmitting}
          className="w-full py-2.5 border-2 border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Another Field
        </button>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl text-sm font-medium transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 rounded-xl text-sm font-semibold shadow-lg shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Create Template'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
