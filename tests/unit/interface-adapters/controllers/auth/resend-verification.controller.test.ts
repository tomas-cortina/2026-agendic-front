import { InputParseError } from '@/src/entities/errors/common';
import { resendVerificationController } from '@/src/interface-adapters/controllers/auth/resend-verification.controller';
import { instrumentation } from '@/tests/unit/stubs';

// No authentication step: a Registro pendiente has no Sesión yet to authenticate with.
describe('resendVerificationController', () => {
    it('resends the verification without returning anything', async () => {
        const resendVerificationUseCase = jest.fn().mockResolvedValue(undefined);

        await expect(
            resendVerificationController(instrumentation, resendVerificationUseCase)({ email: 'ana@negocio.com' }),
        ).resolves.toBeUndefined();
        expect(resendVerificationUseCase).toHaveBeenCalledWith({ email: 'ana@negocio.com' });
    });

    it.each([
        ['the email is malformed', { email: 'ana' }],
        ['the email is missing', {}],
    ])('throws InputParseError when %s', async (_, input) => {
        const resendVerificationUseCase = jest.fn();

        await expect(
            resendVerificationController(instrumentation, resendVerificationUseCase)(input),
        ).rejects.toBeInstanceOf(InputParseError);
        expect(resendVerificationUseCase).not.toHaveBeenCalled();
    });
});
