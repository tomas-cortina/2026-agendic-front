import { compare, hash } from 'bcrypt-ts';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import type { Session } from '@/src/entities/models/session';
import type { User } from '@/src/entities/models/user';

const SALT_ROUNDS = 10;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// ponytail: in-memory sessions, lost on restart; move to a sessions table with the DB (ADR 0001)
export class AuthenticationService implements IAuthenticationService {
    private readonly sessions = new Map<string, Session>();

    constructor(private readonly usersRepository: IUsersRepository) {}

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

    async validateSession(sessionId: string): Promise<{ user: User; session: Session }> {
        const session = this.sessions.get(sessionId);
        if (!session || session.expiresAt < new Date()) {
            throw new UnauthenticatedError('Session is invalid or expired');
        }
        const user = await this.usersRepository.getUser(session.userId);
        if (!user) {
            throw new UnauthenticatedError('Session user no longer exists');
        }
        return { user, session };
    }
}
