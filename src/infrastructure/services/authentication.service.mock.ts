import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { AuthenticationError, EmailTakenError, UnauthenticatedError } from '@/src/entities/errors/auth';
import { isSessionExpired, type Session } from '@/src/entities/models/session';
import type { CreateUser, User } from '@/src/entities/models/user';

// Stands in for the whole back: Usuarios, passwords and Sesiones share one store, as they share one database there.
export class MockAuthenticationService implements IAuthenticationService {
    private readonly users = new Map<string, { user: User; password: string }>();
    private readonly sessions = new Map<string, { session: Session; email: string }>();

    async signUp({ password, ...input }: CreateUser): Promise<Session> {
        if (this.users.has(input.email)) throw new EmailTakenError('Email is already registered');
        this.users.set(input.email, { user: { id: this.users.size + 1, role: 'USER', ...input }, password });
        return this.openSession(input.email);
    }

    async signIn({ email, password }: { email: string; password: string }): Promise<Session> {
        if (this.users.get(email)?.password !== password) throw new AuthenticationError('Invalid email or password');
        return this.openSession(email);
    }

    async getCurrentUser(sessionId: string): Promise<User> {
        return this.userFor(sessionId);
    }

    async invalidateSession(sessionId: string): Promise<void> {
        this.userFor(sessionId);
        this.sessions.delete(sessionId);
    }

    private openSession(email: string): Session {
        const session = { id: crypto.randomUUID(), expiresAt: new Date(Date.now() + 86_400_000) };
        this.sessions.set(session.id, { session, email });
        return session;
    }

    private userFor(sessionId: string): User {
        const entry = this.sessions.get(sessionId);
        const user = entry && !isSessionExpired(entry.session) && this.users.get(entry.email)?.user;
        if (!user) throw new UnauthenticatedError('Missing, expired or signed-out session');
        return user;
    }
}
