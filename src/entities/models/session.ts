import { z } from 'zod';

export const sessionSchema = z.object({
    id: z.string(),
    expiresAt: z.date(),
});
export type Session = z.infer<typeof sessionSchema>;

export const isSessionExpired = (session: Session) => session.expiresAt < new Date();
