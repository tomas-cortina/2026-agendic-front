import { getInjection } from '@/di/container';

const resolveSignUpMethodUseCase = getInjection('IResolveSignUpMethodUseCase');

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
        expect(resolveSignUpMethodUseCase({ email: `ana@${domain}` })).toBe('password');
    });

    it('resolves to password regardless of email casing, since PROVIDER_BY_DOMAIN is intentionally empty', () => {
        expect(resolveSignUpMethodUseCase({ email: 'Ana@GMAIL.com' })).toBe('password');
    });
});
