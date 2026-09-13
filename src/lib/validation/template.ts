import { z } from 'zod';

export const templateFieldSchema = z.object({
  id: z.string().uuid().optional(),
  field_name: z
    .string()
    .trim()
    .min(1, 'Field name is required')
    .max(100, 'Field name must be under 100 characters'),
  unit: z
    .string()
    .trim()
    .max(20, 'Unit must be under 20 characters')
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  order_index: z.number().int().min(0).default(0),
});

export const createTemplateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Template name is required')
    .max(100, 'Template name must be under 100 characters'),
  fields: z
    .array(templateFieldSchema)
    .min(1, 'A template must have at least one field'),
});

export const updateTemplateSchema = z.object({
  id: z.string().uuid('Invalid template ID'),
  name: z
    .string()
    .trim()
    .min(1, 'Template name is required')
    .max(100, 'Template name must be under 100 characters'),
  fields: z
    .array(templateFieldSchema)
    .min(1, 'A template must have at least one field'),
});

export const deleteTemplateSchema = z.object({
  id: z.string().uuid('Invalid template ID'),
});

export type TemplateFieldInput = z.infer<typeof templateFieldSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type DeleteTemplateInput = z.infer<typeof deleteTemplateSchema>;
