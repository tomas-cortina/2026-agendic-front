import { compare, hash } from 'bcrypt-ts';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { Session } from '@/src/entities/models/session';
import type { User } from '@/src/entities/models/user';

const SALT_ROUNDS = 10;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// ponytail: in-memory sessions, lost on restart; move to a sessions table with the DB (ADR 0001)
export class AuthenticationService implements IAuthenticationService {
    private readonly sessions = new Map<string, Session>();

    hashPassword(password: string): Promise<string> {
        return hash(password, SALT_ROUNDS);
    }

    verifyPassword(password: string, passwordHash: string): Promise<boolean> {
        return compare(password, passwordHash);
    }

    async createSession(user: User): Promise<Session> {
        const session = {
            id: crypto.randomUUID(),
            userId: user.id,
            expiresAt: new Date(Date.now() + SESSION_TTL_MS),
        };
        this.sessions.set(session.id, session);
        return session;
    }
}
