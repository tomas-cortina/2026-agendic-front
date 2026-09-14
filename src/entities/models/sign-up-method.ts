import { z } from 'zod';

export const signUpMethodSchema = z.enum(['google', 'microsoft', 'password']);
export type SignUpMethod = z.infer<typeof signUpMethodSchema>;
