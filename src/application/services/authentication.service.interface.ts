import type { Session } from '@/src/entities/models/session';
import type { CreateUser, User } from '@/src/entities/models/user';

// Sign-up lives here, not in a users repository: it's the same back endpoint /users hits for auth.
export interface IAuthenticationService {
    // Opens a Registro pendiente and sends the Link de verificación; no Sesión until the Usuario verifies.
    signUp(input: CreateUser): Promise<void>;
    signIn(credentials: { email: string; password: string }): Promise<Session>;
    // Redeems a Link de verificación: the token buys a Sesión, so the Usuario lands signed in.
    verifyEmail(token: string): Promise<Session>;
    getCurrentUser(sessionId: string): Promise<User>;
    invalidateSession(sessionId: string): Promise<void>;
}
