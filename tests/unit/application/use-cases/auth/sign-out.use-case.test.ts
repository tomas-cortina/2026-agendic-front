import { signOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { authWith, instrumentation } from '@/tests/unit/stubs';

describe('signOutUseCase', () => {
    it('invalidates the Sesión on the back', async () => {
        const invalidateSession = jest.fn().mockResolvedValue(undefined);

        await expect(signOutUseCase(instrumentation, authWith({ invalidateSession }))('session-123')).resolves.toBeUndefined();
        expect(invalidateSession).toHaveBeenCalledWith('session-123');
    });

    it('throws UnauthenticatedError when the back rejects the Sesión', async () => {
        const invalidateSession = jest
            .fn()
            .mockRejectedValue(new UnauthenticatedError('Missing, expired or signed-out session'));

        await expect(
            signOutUseCase(instrumentation, authWith({ invalidateSession }))('session-123'),
        ).rejects.toBeInstanceOf(UnauthenticatedError);
    });
});
