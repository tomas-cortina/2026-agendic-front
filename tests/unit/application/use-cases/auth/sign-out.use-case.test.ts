import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/src/entities/errors/auth';

const signUpUseCase = getInjection('ISignUpUseCase');
const signOutUseCase = getInjection('ISignOutUseCase');
const getCurrentUserController = getInjection('IGetCurrentUserController');

describe('signOutUseCase', () => {
    it('ends the session so it no longer validates', async () => {
        const session = await signUpUseCase({
            email: 'ana@negocio.com',
            name: 'Ana Pérez',
            password: 'correct horse battery',
        });

        await signOutUseCase(session.id);

        await expect(getCurrentUserController(session.id)).rejects.toBeInstanceOf(UnauthenticatedError);
    });
});
