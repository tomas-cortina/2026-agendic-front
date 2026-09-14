import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { isSessionExpired, type Session } from '@/src/entities/models/session';
import type { User } from '@/src/entities/models/user';

export class MockAuthenticationService implements IAuthenticationService {
    private readonly sessions = new Map<string, Session>();

    constructor(private readonly usersRepository: IUsersRepository) {}

    async hashPassword(password: string): Promise<string> {
        return `hashed:${password}`;
    }

    async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
        return passwordHash === `hashed:${password}`;
    }

    async createSession(user: User): Promise<Session> {
        const session = { id: crypto.randomUUID(), userId: user.id, expiresAt: new Date(Date.now() + 86_400_000) };
        this.sessions.set(session.id, session);
        return session;
    }

    // ponytail: mirrors AuthenticationService.validateSession (lint forbids sharing infra code); goes away when sessions move to the DB (ADR 0001)
    async validateSession(sessionId: string): Promise<{ user: User; session: Session }> {
        const session = this.sessions.get(sessionId);
        if (!session || isSessionExpired(session)) {
            throw new UnauthenticatedError('Session is invalid or expired');
        }
        const user = await this.usersRepository.getUser(session.userId);
        if (!user) {
            throw new UnauthenticatedError('Session user no longer exists');
        }
        return { user, session };
    }

    async invalidateSession(sessionId: string): Promise<void> {
        this.sessions.delete(sessionId);
    }
}
