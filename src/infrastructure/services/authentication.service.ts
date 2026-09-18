import { z } from 'zod';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import {
    AuthenticationError,
    EmailTakenError,
    UnauthenticatedError,
    VerificationCodeExpiredError,
    VerificationCodeInvalidError,
} from '@/src/entities/errors/auth';
import { BackendValidationError } from '@/src/entities/errors/common';
import type { Session } from '@/src/entities/models/session';
import {
    userSchema,
    type CreateUser,
    type User,
} from '@/src/entities/models/user';

const sessionResponseSchema = z
    .object({ sessionId: z.string(), expiresAt: z.coerce.date() })
    .transform(
        ({ sessionId, expiresAt }): Session => ({ id: sessionId, expiresAt }),
    );

type ErrorsByStatus = Record<number, (options: ErrorOptions) => Error>;

const invalidSessionErrors: ErrorsByStatus = {
    401: (options) =>
        new UnauthenticatedError(
            'Missing, expired or signed-out session',
            options,
        ),
};

export class AuthenticationService implements IAuthenticationService {
    constructor(private readonly apiBaseUrl: string) {}

    async signUp(input: CreateUser): Promise<void> {
        await this.request('POST', '/users', {
            body: input,
            errors: {
                409: (options) =>
                    new EmailTakenError('Email is already registered', options),
            },
        });
    }

    async signIn(credentials: {
        email: string;
        password: string;
    }): Promise<Session> {
        const response = await this.request('POST', '/sessions', {
            body: credentials,
            errors: {
                401: (options) =>
                    new AuthenticationError(
                        'Invalid email or password',
                        options,
                    ),
            },
        });
        return sessionResponseSchema.parse(await response.json());
    }

    // 410 = expired, 400 = invalid, already used or tampered with. If the back's codes change, only this map moves.
    async verifyEmail(email: string, code: string): Promise<Session> {
        const response = await this.request('POST', '/users/verification', {
            body: { email, code },
            errors: {
                410: (options) =>
                    new VerificationCodeExpiredError(
                        'Verification code expired',
                        options,
                    ),
                400: (options) =>
                    new VerificationCodeInvalidError(
                        'Verification code is not usable',
                        options,
                    ),
            },
        });
        return sessionResponseSchema.parse(await response.json());
    }

    // 202 always, exists or not, so the response never leaks who's registered.
    async resendVerification(email: string): Promise<void> {
        await this.request('POST', '/users/verification/resend', {
            body: { email },
        });
    }

    async getCurrentUser(sessionId: string): Promise<User> {
        const response = await this.request('GET', '/users/me', {
            sessionId,
            errors: invalidSessionErrors,
        });
        return userSchema.parse(await response.json());
    }

    async invalidateSession(sessionId: string): Promise<void> {
        await this.request('DELETE', '/sessions/current', {
            sessionId,
            errors: invalidSessionErrors,
        });
    }

    private async request(
        method: 'GET' | 'POST' | 'DELETE',
        path: string,
        {
            body,
            sessionId,
            errors = {},
        }: { body?: unknown; sessionId?: string; errors?: ErrorsByStatus },
    ): Promise<Response> {
        const response = await fetch(`${this.apiBaseUrl}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(sessionId ? { Authorization: `Bearer ${sessionId}` } : {}),
            },
            body: body === undefined ? undefined : JSON.stringify(body),
            cache: 'no-store',
        });
        if (response.ok) return response;

        const options = { cause: await response.json().catch(() => undefined) };
        const toError = errors[response.status];
        if (toError) throw toError(options);
        if (response.status === 400)
            throw new BackendValidationError(
                'Back rejected the input',
                options,
            );
        throw new Error(
            `Back answered ${response.status} to ${method} ${path}`,
            options,
        );
    }
}
