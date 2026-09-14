import { getInjection } from '@/di/container';
import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';

const signUpController = getInjection('ISignUpController');
const signInController = getInjection('ISignInController');

const credentials = { email: 'ana@negocio.com', password: 'correct horse battery' };

beforeAll(async () => {
    await signUpController({ ...credentials, name: 'Ana Pérez' });
});

// No "unauthenticated" case: sign-in happens before any session exists.
describe('signInController', () => {
    it('returns a new session for valid credentials', async () => {
        await expect(signInController(credentials)).resolves.toEqual({
            sessionId: expect.any(String),
            expiresAt: expect.any(Date),
        });
    });

    it('accepts the email in any case', async () => {
        await expect(signInController({ ...credentials, email: 'ANA@Negocio.com' })).resolves.toHaveProperty(
            'sessionId',
        );
    });

    it('throws AuthenticationError for a wrong password', async () => {
        await expect(signInController({ ...credentials, password: 'wrong password' })).rejects.toBeInstanceOf(
            AuthenticationError,
        );
    });

    it.each([
        ['the email is malformed', { ...credentials, email: 'ana' }],
        ['the password is empty', { ...credentials, password: '' }],
        ['every field is missing', {}],
    ])('throws InputParseError when %s', async (_, input) => {
        await expect(signInController(input)).rejects.toBeInstanceOf(InputParseError);
    });
});
