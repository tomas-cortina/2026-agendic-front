import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { signOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import { instrumentation } from '@/tests/unit/stubs';

describe('signOutController', () => {
    it('ends the session for a signed-in Usuario', async () => {
        const signOutUseCase = jest.fn().mockResolvedValue(undefined);

        await expect(signOutController(instrumentation, signOutUseCase)('session-123')).resolves.toBeUndefined();
        expect(signOutUseCase).toHaveBeenCalledWith('session-123');
    });

    it('throws UnauthenticatedError when there is no session id', async () => {
        const signOutUseCase = jest.fn();

        await expect(signOutController(instrumentation, signOutUseCase)(undefined)).rejects.toBeInstanceOf(
            UnauthenticatedError,
        );
        expect(signOutUseCase).not.toHaveBeenCalled();
    });

    // Covers an already-closed Sesión: the back answers 401.
    it('throws UnauthenticatedError when the back rejects the session', async () => {
        const signOutUseCase = jest
            .fn()
            .mockRejectedValue(new UnauthenticatedError('Missing, expired or signed-out session'));

        await expect(signOutController(instrumentation, signOutUseCase)('session-123')).rejects.toBeInstanceOf(
            UnauthenticatedError,
        );
    });
});
