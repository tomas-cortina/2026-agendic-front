import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { Session } from '@/src/entities/models/session';
import type { User } from '@/src/entities/models/user';

export class MockAuthenticationService implements IAuthenticationService {
    async hashPassword(password: string): Promise<string> {
        return `hashed:${password}`;
    }

    async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
        return passwordHash === `hashed:${password}`;
    }

    async createSession(user: User): Promise<Session> {
        return { id: crypto.randomUUID(), userId: user.id, expiresAt: new Date(Date.now() + 86_400_000) };
    }
}
