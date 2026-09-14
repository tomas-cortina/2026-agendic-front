import { z } from 'zod';

export const userSchema = z.object({
    id: z.number().int(),
    email: z.email().toLowerCase(),
    name: z.string().trim().min(1),
    role: z.enum(['ADMIN', 'USER']),
});
export type User = z.infer<typeof userSchema>;

// Mirrors the back's 12–72 rule, but zod counts UTF-16 units and the back counts code points,
// so an emoji-heavy password can still come back as BackendValidationError.
export const passwordSchema = z.string().min(12).max(72);

export const createUserSchema = userSchema.pick({ email: true, name: true }).extend({ password: passwordSchema });
export type CreateUser = z.infer<typeof createUserSchema>;
