import type { Session } from '@/src/entities/models/session';
import type { CreateUser, User } from '@/src/entities/models/user';

// Sign-up lives here, not in a users repository: the back's POST /users answers with a Sesión.
export interface IAuthenticationService {
    signUp(input: CreateUser): Promise<Session>;
    signIn(credentials: { email: string; password: string }): Promise<Session>;
    getCurrentUser(sessionId: string): Promise<User>;
    invalidateSession(sessionId: string): Promise<void>;
}
