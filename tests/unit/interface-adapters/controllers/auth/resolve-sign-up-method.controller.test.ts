import { getInjection } from '@/di/container';
import { InputParseError } from '@/src/entities/errors/common';

const resolveSignUpMethodController = getInjection('IResolveSignUpMethodController');

// No "unauthenticated" case: sign-up happens before any session exists.
describe('resolveSignUpMethodController', () => {
    it('returns the sign-up method for a valid email', async () => {
        await expect(resolveSignUpMethodController({ email: 'ana@gmail.com' })).resolves.toEqual({
            method: 'google',
        });
    });

    it('throws InputParseError for a malformed email', async () => {
        await expect(resolveSignUpMethodController({ email: 'ana' })).rejects.toBeInstanceOf(
            InputParseError,
        );
    });

    it('throws InputParseError when the email is missing', async () => {
        await expect(resolveSignUpMethodController({})).rejects.toBeInstanceOf(InputParseError);
    });
});
