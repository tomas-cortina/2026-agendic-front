import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    email: z.email().toLowerCase(),
    name: z.string().trim().min(1),
    passwordHash: z.string(),
});
export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.omit({ id: true });
export type CreateUser = z.infer<typeof createUserSchema>;

// bcrypt ignores everything past 72 bytes.
export const passwordSchema = z.string().min(12).max(72);
