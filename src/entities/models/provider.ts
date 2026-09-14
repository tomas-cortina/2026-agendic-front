import { z } from 'zod';

export const providerSchema = z.enum(['google', 'microsoft']);
export type Provider = z.infer<typeof providerSchema>;
