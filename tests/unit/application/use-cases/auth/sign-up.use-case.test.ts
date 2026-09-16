import { signUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { EmailTakenError } from '@/src/entities/errors/auth';
import { authWith, instrumentation } from '@/tests/unit/stubs';

const newUsuario = { email: 'ana@negocio.com', name: 'Ana Pérez', password: 'correct horse battery' };

describe('signUpUseCase', () => {
    it('registers the Usuario without returning a Sesión', async () => {
        const signUp = jest.fn().mockResolvedValue(undefined);

        await expect(signUpUseCase(instrumentation, authWith({ signUp }))(newUsuario)).resolves.toBeUndefined();
        expect(signUp).toHaveBeenCalledWith(newUsuario);
    });

    it('throws EmailTakenError when the email is already registered', async () => {
        const signUp = jest.fn().mockRejectedValue(new EmailTakenError('Email is already registered'));

        await expect(signUpUseCase(instrumentation, authWith({ signUp }))(newUsuario)).rejects.toBeInstanceOf(
            EmailTakenError,
        );
    });
});
