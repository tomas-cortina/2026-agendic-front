import { resolveSignUpMethodUseCase } from '@/src/application/use-cases/auth/resolve-sign-up-method.use-case';
import { instrumentation } from '@/tests/unit/stubs';

const resolveSignUpMethod = resolveSignUpMethodUseCase(instrumentation);

describe('resolveSignUpMethodUseCase', () => {
    it.each([
        'gmail.com',
        'googlemail.com',
        'outlook.com',
        'hotmail.com',
        'live.com',
        'msn.com',
        'tunegocio.com',
    ])('resolves %s to password', (domain) => {
        expect(resolveSignUpMethod({ email: `ana@${domain}` })).toBe('password');
    });

    it('resolves to password regardless of email casing, since PROVIDER_BY_DOMAIN is intentionally empty', () => {
        expect(resolveSignUpMethod({ email: 'Ana@GMAIL.com' })).toBe('password');
    });
});
