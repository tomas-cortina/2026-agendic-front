import { getInjection } from '@/di/container';
import { EmailTakenError } from '@/src/entities/errors/auth';

const signUpUseCase = getInjection('ISignUpUseCase');
const authenticationService = getInjection('IAuthenticationService');

describe('signUpUseCase', () => {
    it('creates the Usuario and returns a Sesión that identifies them', async () => {
        const session = await signUpUseCase({
            email: 'ana@negocio.com',
            name: 'Ana Pérez',
            password: 'correct horse battery',
        });

        await expect(authenticationService.getCurrentUser(session.id)).resolves.toMatchObject({
            email: 'ana@negocio.com',
            name: 'Ana Pérez',
            role: 'USER',
        });
    });

    it('throws EmailTakenError when the email is already registered', async () => {
        await signUpUseCase({ email: 'beto@negocio.com', name: 'Beto', password: 'correct horse battery' });

        await expect(
            signUpUseCase({ email: 'beto@negocio.com', name: 'Otro Beto', password: 'another long password' }),
        ).rejects.toBeInstanceOf(EmailTakenError);
    });
});
