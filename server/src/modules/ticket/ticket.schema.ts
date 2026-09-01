import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.enum(['bug', 'feature_request', 'question', 'account_issue', 'other']),
  reporterName: z.string().min(1, 'Reporter name is required'),
  reporterEmail: z.string().email('Invalid email format'),
  assigneeId: z.number().nullable().optional(),
});

export const updateTicketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.enum(['bug', 'feature_request', 'question', 'account_issue', 'other']).optional(),
  reporterName: z.string().min(1, 'Reporter name is required').optional(),
  reporterEmail: z.string().email('Invalid email format').optional(),
  assigneeId: z.number().nullable().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
});
