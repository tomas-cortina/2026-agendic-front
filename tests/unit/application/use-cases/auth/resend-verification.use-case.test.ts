import { resendVerificationUseCase } from '@/src/application/use-cases/auth/resend-verification.use-case';
import { authWith, instrumentation } from '@/tests/unit/stubs';

describe('resendVerificationUseCase', () => {
    it('resends the verification without returning anything', async () => {
        const resendVerification = jest.fn().mockResolvedValue(undefined);

        await expect(
            resendVerificationUseCase(instrumentation, authWith({ resendVerification }))({ email: 'ana@negocio.com' }),
        ).resolves.toBeUndefined();
        expect(resendVerification).toHaveBeenCalledWith('ana@negocio.com');
    });
});
