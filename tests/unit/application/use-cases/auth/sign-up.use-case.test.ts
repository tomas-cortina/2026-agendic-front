import { getInjection } from '@/di/container';
import { EmailTakenError } from '@/src/entities/errors/auth';

const signUpUseCase = getInjection('ISignUpUseCase');
const usersRepository = getInjection('IUsersRepository');

describe('signUpUseCase', () => {
    it('stores the user with a hashed password and returns a session for them', async () => {
        const session = await signUpUseCase({
            email: 'ana@negocio.com',
            name: 'Ana Pérez',
            password: 'correct horse battery',
        });

        const user = await usersRepository.getUserByEmail('ana@negocio.com');
        expect(user).toMatchObject({ email: 'ana@negocio.com', name: 'Ana Pérez' });
        expect(user?.passwordHash).not.toBe('correct horse battery');
        expect(session.userId).toBe(user?.id);
    });

    it('throws EmailTakenError when the email is already registered', async () => {
        await signUpUseCase({ email: 'beto@negocio.com', name: 'Beto', password: 'correct horse battery' });

        await expect(
            signUpUseCase({ email: 'beto@negocio.com', name: 'Otro Beto', password: 'another long password' }),
        ).rejects.toBeInstanceOf(EmailTakenError);
    });
});
