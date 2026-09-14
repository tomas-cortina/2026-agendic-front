import { getInjection } from '@/di/container';
import { NotFoundError } from '@/src/entities/errors/common';

const signUpUseCase = getInjection('ISignUpUseCase');
const getCurrentUserUseCase = getInjection('IGetCurrentUserUseCase');

describe('getCurrentUserUseCase', () => {
    it('returns the user for a known id', async () => {
        const session = await signUpUseCase({
            email: 'ana@negocio.com',
            name: 'Ana Pérez',
            password: 'correct horse battery',
        });

        await expect(getCurrentUserUseCase(session.userId)).resolves.toMatchObject({ name: 'Ana Pérez' });
    });

    it('throws NotFoundError for an unknown id', async () => {
        await expect(getCurrentUserUseCase(crypto.randomUUID())).rejects.toBeInstanceOf(NotFoundError);
    });
});
