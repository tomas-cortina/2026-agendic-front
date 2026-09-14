import { z } from 'zod';
import { providerSchema } from './provider';

export const signUpMethodSchema = z.enum([...providerSchema.options, 'password'] as const);
export type SignUpMethod = z.infer<typeof signUpMethodSchema>;
