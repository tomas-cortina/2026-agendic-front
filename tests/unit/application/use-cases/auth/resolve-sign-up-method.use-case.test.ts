import { getInjection } from '@/di/container';

const resolveSignUpMethodUseCase = getInjection('IResolveSignUpMethodUseCase');

describe('resolveSignUpMethodUseCase', () => {
    it.each(['gmail.com', 'googlemail.com'])('resolves %s to google', (domain) => {
        expect(resolveSignUpMethodUseCase({ email: `ana@${domain}` })).toBe('google');
    });

    it.each(['outlook.com', 'hotmail.com', 'live.com', 'msn.com'])(
        'resolves %s to microsoft',
        (domain) => {
            expect(resolveSignUpMethodUseCase({ email: `ana@${domain}` })).toBe('microsoft');
        },
    );

    it('resolves any other domain to password', () => {
        expect(resolveSignUpMethodUseCase({ email: 'ana@tunegocio.com' })).toBe('password');
    });

    it('matches the domain case-insensitively', () => {
        expect(resolveSignUpMethodUseCase({ email: 'Ana@GMAIL.com' })).toBe('google');
    });

    it('only matches the exact domain, not subdomains', () => {
        expect(resolveSignUpMethodUseCase({ email: 'ana@mail.gmail.com' })).toBe('password');
    });
});
