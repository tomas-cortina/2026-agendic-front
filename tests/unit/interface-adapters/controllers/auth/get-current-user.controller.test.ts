import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { getCurrentUserController } from '@/src/interface-adapters/controllers/auth/get-current-user.controller';
import { authWith, instrumentation } from '@/tests/unit/stubs';

const usuario = { id: 7, name: 'Ana Pérez', email: 'ana@negocio.com', role: 'USER' };

describe('getCurrentUserController', () => {
    it('returns the name of the Usuario behind the session', async () => {
        const getCurrentUser = jest.fn().mockResolvedValue(usuario);

        await expect(getCurrentUserController(instrumentation, authWith({ getCurrentUser }))('session-123')).resolves.toEqual({
            name: 'Ana Pérez',
        });
        expect(getCurrentUser).toHaveBeenCalledWith('session-123');
    });

    // authWith({}) rejects with a plain Error, so reaching the back would fail this test.
    it('throws UnauthenticatedError when there is no session id', async () => {
        await expect(getCurrentUserController(instrumentation, authWith({}))(undefined)).rejects.toBeInstanceOf(
            UnauthenticatedError,
        );
    });

    // Covers unknown, expired and signed-out Sesiones alike: the back answers 401 to all three.
    it('throws UnauthenticatedError when the back rejects the session', async () => {
        const getCurrentUser = jest
            .fn()
            .mockRejectedValue(new UnauthenticatedError('Missing, expired or signed-out session'));

        await expect(
            getCurrentUserController(instrumentation, authWith({ getCurrentUser }))('session-123'),
        ).rejects.toBeInstanceOf(UnauthenticatedError);
    });
});
