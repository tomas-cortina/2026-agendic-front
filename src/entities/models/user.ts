import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    email: z.email().toLowerCase(),
    name: z.string().trim().min(1),
});
export type User = z.infer<typeof userSchema>;
