import { signInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { AuthenticationError } from '@/src/entities/errors/auth';
import { authWith, instrumentation } from '@/tests/unit/stubs';

const credentials = { email: 'ana@negocio.com', password: 'correct horse battery' };
const session = { id: 'session-123', expiresAt: new Date('2026-10-14T00:00:00.000Z') };

describe('signInUseCase', () => {
    it('returns the Sesión the back issued for the credentials', async () => {
        const signIn = jest.fn().mockResolvedValue(session);

        await expect(signInUseCase(instrumentation, authWith({ signIn }))(credentials)).resolves.toEqual(session);
        expect(signIn).toHaveBeenCalledWith(credentials);
    });

    // Unknown email and wrong password are one case: the back decides, and answers 401 to both.
    it('throws AuthenticationError when the back rejects the credentials', async () => {
        const signIn = jest.fn().mockRejectedValue(new AuthenticationError('Invalid email or password'));

        await expect(signInUseCase(instrumentation, authWith({ signIn }))(credentials)).rejects.toBeInstanceOf(
            AuthenticationError,
        );
    });
});
