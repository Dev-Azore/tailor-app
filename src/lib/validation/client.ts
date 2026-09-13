import { z } from 'zod';

export const createClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Client name is required')
    .max(100, 'Client name must be under 100 characters'),
  phone: z
    .string()
    .trim()
    .max(25, 'Phone number must be under 25 characters')
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes must be under 500 characters')
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
});

export const updateClientSchema = z.object({
  id: z.string().uuid('Invalid client ID'),
  name: z
    .string()
    .trim()
    .min(1, 'Client name is required')
    .max(100, 'Client name must be under 100 characters'),
  phone: z
    .string()
    .trim()
    .max(25, 'Phone number must be under 25 characters')
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes must be under 500 characters')
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
});

export const deleteClientSchema = z.object({
  id: z.string().uuid('Invalid client ID'),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type DeleteClientInput = z.infer<typeof deleteClientSchema>;
