import { resolveSignUpMethodUseCase } from '@/src/application/use-cases/auth/resolve-sign-up-method.use-case';
import { InputParseError } from '@/src/entities/errors/common';
import { resolveSignUpMethodController } from '@/src/interface-adapters/controllers/auth/resolve-sign-up-method.controller';
import { instrumentation } from '@/tests/unit/stubs';

// The use case is pure, so it runs for real instead of being stubbed.
const resolveSignUpMethod = resolveSignUpMethodController(instrumentation, resolveSignUpMethodUseCase(instrumentation));

// No "unauthenticated" case: sign-up happens before any session exists.
describe('resolveSignUpMethodController', () => {
    it('returns the sign-up method for a valid email', async () => {
        await expect(resolveSignUpMethod({ email: 'ana@gmail.com' })).resolves.toEqual({ method: 'password' });
    });

    it('throws InputParseError for a malformed email', async () => {
        await expect(resolveSignUpMethod({ email: 'ana' })).rejects.toBeInstanceOf(InputParseError);
    });

    it('throws InputParseError when the email is missing', async () => {
        await expect(resolveSignUpMethod({})).rejects.toBeInstanceOf(InputParseError);
    });
});
