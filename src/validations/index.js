import { z } from 'zod';

export const urlSchema = z.object({
  longUrl: z.string().url(),
  customAlias: z.string().min(3).max(20).optional(),
  topic: z.enum(['acquisition', 'activation', 'retention']).optional(),
});

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
