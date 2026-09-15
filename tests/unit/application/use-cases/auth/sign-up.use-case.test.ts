import { signUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { EmailTakenError } from '@/src/entities/errors/auth';
import { authWith, instrumentation } from '@/tests/unit/stubs';

const newUsuario = { email: 'ana@negocio.com', name: 'Ana Pérez', password: 'correct horse battery' };
const session = { id: 'session-123', expiresAt: new Date('2026-10-14T00:00:00.000Z') };

describe('signUpUseCase', () => {
    it('registers the Usuario and returns the Sesión the back issued', async () => {
        const signUp = jest.fn().mockResolvedValue(session);

        await expect(signUpUseCase(instrumentation, authWith({ signUp }))(newUsuario)).resolves.toEqual(session);
        expect(signUp).toHaveBeenCalledWith(newUsuario);
    });

    it('throws EmailTakenError when the email is already registered', async () => {
        const signUp = jest.fn().mockRejectedValue(new EmailTakenError('Email is already registered'));

        await expect(signUpUseCase(instrumentation, authWith({ signUp }))(newUsuario)).rejects.toBeInstanceOf(
            EmailTakenError,
        );
    });
});
