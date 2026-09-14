import { getInjection } from '@/di/container';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signUpUseCase = getInjection('ISignUpUseCase');
const signInUseCase = getInjection('ISignInUseCase');
const authenticationService = getInjection('IAuthenticationService');

const credentials = { email: 'ana@negocio.com', password: 'correct horse battery' };

beforeAll(async () => {
    await signUpUseCase({ ...credentials, name: 'Ana Pérez' });
});

describe('signInUseCase', () => {
    it('returns a Sesión that identifies the Usuario with valid credentials', async () => {
        const session = await signInUseCase(credentials);

        await expect(authenticationService.getCurrentUser(session.id)).resolves.toMatchObject({
            email: credentials.email,
        });
    });

    it('throws AuthenticationError for an unknown email', async () => {
        await expect(signInUseCase({ ...credentials, email: 'nadie@negocio.com' })).rejects.toBeInstanceOf(
            AuthenticationError,
        );
    });

    it('throws AuthenticationError for a wrong password', async () => {
        await expect(signInUseCase({ ...credentials, password: 'wrong password' })).rejects.toBeInstanceOf(
            AuthenticationError,
        );
    });
});
