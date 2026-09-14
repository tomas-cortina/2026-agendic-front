import { AuthenticationError, EmailTakenError, UnauthenticatedError } from '@/src/entities/errors/auth';
import { BackendValidationError } from '@/src/entities/errors/common';
import { AuthenticationService } from '@/src/infrastructure/services/authentication.service';

const API_BASE_URL = 'http://back.test';
const authenticationService = new AuthenticationService(API_BASE_URL);

const newUsuario = { email: 'ana@negocio.com', name: 'Ana Pérez', password: 'correct horse battery' };
const issuedSession = { sessionId: 'session-123', expiresAt: '2026-10-14T00:00:00.000Z' };

const backendResponds = (status: number, body?: unknown) =>
    jest
        .spyOn(global, 'fetch')
        .mockResolvedValue(new Response(body === undefined ? null : JSON.stringify(body), { status }));

afterEach(() => jest.restoreAllMocks());

describe('AuthenticationService', () => {
    describe('signUp', () => {
        it('POSTs the new Usuario to /users and returns the Sesión the back issued', async () => {
            const fetchMock = backendResponds(201, issuedSession);

            await expect(authenticationService.signUp(newUsuario)).resolves.toEqual({
                id: 'session-123',
                expiresAt: new Date('2026-10-14T00:00:00.000Z'),
            });
            expect(fetchMock).toHaveBeenCalledWith(
                'http://back.test/users',
                expect.objectContaining({ method: 'POST', body: JSON.stringify(newUsuario) }),
            );
        });

        it('throws EmailTakenError when the back answers 409', async () => {
            backendResponds(409, { statusCode: 409, message: 'Email already registered' });

            await expect(authenticationService.signUp(newUsuario)).rejects.toBeInstanceOf(EmailTakenError);
        });

        it('throws BackendValidationError when the back rejects the input with 400', async () => {
            backendResponds(400, { statusCode: 400, message: ['password must be longer than or equal to 12 characters'] });

            await expect(authenticationService.signUp(newUsuario)).rejects.toBeInstanceOf(BackendValidationError);
        });
    });

    describe('signIn', () => {
        const credentials = { email: newUsuario.email, password: newUsuario.password };

        it('POSTs the credentials to /sessions and returns the Sesión the back issued', async () => {
            const fetchMock = backendResponds(201, issuedSession);

            await expect(authenticationService.signIn(credentials)).resolves.toEqual({
                id: 'session-123',
                expiresAt: new Date('2026-10-14T00:00:00.000Z'),
            });
            expect(fetchMock).toHaveBeenCalledWith(
                'http://back.test/sessions',
                expect.objectContaining({ method: 'POST', body: JSON.stringify(credentials) }),
            );
        });

        it('throws AuthenticationError when the back answers 401', async () => {
            backendResponds(401, { statusCode: 401, message: 'Invalid email or password' });

            await expect(authenticationService.signIn(credentials)).rejects.toBeInstanceOf(AuthenticationError);
        });
    });

    describe('getCurrentUser', () => {
        it('GETs /users/me with the Sesión as a Bearer token and returns the Usuario', async () => {
            const usuario = { id: 7, name: 'Ana Pérez', email: 'ana@negocio.com', role: 'USER' };
            const fetchMock = backendResponds(200, usuario);

            await expect(authenticationService.getCurrentUser('session-123')).resolves.toEqual(usuario);
            expect(fetchMock).toHaveBeenCalledWith(
                'http://back.test/users/me',
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({ Authorization: 'Bearer session-123' }),
                }),
            );
        });

        it('throws UnauthenticatedError when the back answers 401', async () => {
            backendResponds(401, { statusCode: 401, message: 'Missing, expired or signed-out session' });

            await expect(authenticationService.getCurrentUser('session-123')).rejects.toBeInstanceOf(
                UnauthenticatedError,
            );
        });
    });

    describe('invalidateSession', () => {
        it('DELETEs /sessions/current with the Sesión as a Bearer token', async () => {
            const fetchMock = backendResponds(204);

            await expect(authenticationService.invalidateSession('session-123')).resolves.toBeUndefined();
            expect(fetchMock).toHaveBeenCalledWith(
                'http://back.test/sessions/current',
                expect.objectContaining({
                    method: 'DELETE',
                    headers: expect.objectContaining({ Authorization: 'Bearer session-123' }),
                }),
            );
        });

        it('throws UnauthenticatedError when the back answers 401', async () => {
            backendResponds(401, { statusCode: 401, message: 'Missing, expired or signed-out session' });

            await expect(authenticationService.invalidateSession('session-123')).rejects.toBeInstanceOf(
                UnauthenticatedError,
            );
        });
    });
});
