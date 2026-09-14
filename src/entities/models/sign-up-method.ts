import { z } from 'zod';

export const providerSchema = z.enum(['google', 'microsoft']);
export type Provider = z.infer<typeof providerSchema>;

export const signUpMethodSchema = z.enum([...providerSchema.options, 'password'] as const);
export type SignUpMethod = z.infer<typeof signUpMethodSchema>;
