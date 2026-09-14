import type { Session } from '@/src/entities/models/session';
import type { User } from '@/src/entities/models/user';

export interface IAuthenticationService {
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, passwordHash: string): Promise<boolean>;
    createSession(user: User): Promise<Session>;
    validateSession(sessionId: string): Promise<{ user: User; session: Session }>;
    invalidateSession(sessionId: string): Promise<void>;
}
