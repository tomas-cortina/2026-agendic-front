import { getInjection } from '@/di/container';
import { EmailTakenError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';

const signUpController = getInjection('ISignUpController');

const valid = { email: 'ana@negocio.com', name: 'Ana Pérez', password: 'correct horse battery' };

// No "unauthenticated" case: sign-up happens before any session exists.
describe('signUpController', () => {
    it('returns the new session', async () => {
        await expect(signUpController(valid)).resolves.toEqual({
            sessionId: expect.any(String),
            expiresAt: expect.any(Date),
        });
    });

    it('treats emails case-insensitively', async () => {
        await signUpController({ ...valid, email: 'Beto@Negocio.com' });

        await expect(signUpController({ ...valid, email: 'beto@negocio.com' })).rejects.toBeInstanceOf(
            EmailTakenError,
        );
    });

    it.each([
        ['the email is malformed', { ...valid, email: 'ana' }],
        ['the name is blank', { ...valid, name: '   ' }],
        ['the password is shorter than 12 characters', { ...valid, password: 'short' }],
        ['the password is longer than 72 characters', { ...valid, password: 'a'.repeat(73) }],
        ['every field is missing', {}],
    ])('throws InputParseError when %s', async (_, input) => {
        await expect(signUpController(input)).rejects.toBeInstanceOf(InputParseError);
    });
});
