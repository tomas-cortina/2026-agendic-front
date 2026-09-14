import { getInjection } from '@/di/container';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signUpUseCase = getInjection('ISignUpUseCase');
const signInUseCase = getInjection('ISignInUseCase');
const usersRepository = getInjection('IUsersRepository');

const credentials = { email: 'ana@negocio.com', password: 'correct horse battery' };

beforeAll(async () => {
    await signUpUseCase({ ...credentials, name: 'Ana Pérez' });
});

describe('signInUseCase', () => {
    it('returns a session for the user with valid credentials', async () => {
        const session = await signInUseCase(credentials);

        const user = await usersRepository.getUserByEmail(credentials.email);
        expect(session.userId).toBe(user?.id);
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
