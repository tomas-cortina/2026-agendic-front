import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { signInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { instrumentation } from '@/tests/unit/stubs';

const credentials = { email: 'ana@negocio.com', password: 'correct horse battery' };
const session = { id: 'session-123', expiresAt: new Date('2026-10-14T00:00:00.000Z') };

// No "unauthenticated" case: sign-in happens before any session exists.
describe('signInController', () => {
    it('returns a new session for valid credentials', async () => {
        const signInUseCase = jest.fn().mockResolvedValue(session);

        await expect(signInController(instrumentation, signInUseCase)(credentials)).resolves.toEqual({
            sessionId: 'session-123',
            expiresAt: session.expiresAt,
        });
        expect(signInUseCase).toHaveBeenCalledWith(credentials);
    });

    it('lowercases the email before signing in', async () => {
        const signInUseCase = jest.fn().mockResolvedValue(session);

        await signInController(instrumentation, signInUseCase)({ ...credentials, email: 'ANA@Negocio.com' });

        expect(signInUseCase).toHaveBeenCalledWith(credentials);
    });

    it('throws AuthenticationError when the back rejects the credentials', async () => {
        const signInUseCase = jest.fn().mockRejectedValue(new AuthenticationError('Invalid email or password'));

        await expect(signInController(instrumentation, signInUseCase)(credentials)).rejects.toBeInstanceOf(
            AuthenticationError,
        );
    });

    it.each([
        ['the email is malformed', { ...credentials, email: 'ana' }],
        ['the password is empty', { ...credentials, password: '' }],
        ['every field is missing', {}],
    ])('throws InputParseError when %s', async (_, input) => {
        const signInUseCase = jest.fn();

        await expect(signInController(instrumentation, signInUseCase)(input)).rejects.toBeInstanceOf(InputParseError);
        expect(signInUseCase).not.toHaveBeenCalled();
    });
});
