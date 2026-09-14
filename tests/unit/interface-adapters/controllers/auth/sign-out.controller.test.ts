import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/src/entities/errors/auth';

const signUpController = getInjection('ISignUpController');
const signOutController = getInjection('ISignOutController');
const getCurrentUserController = getInjection('IGetCurrentUserController');

const valid = { email: 'ana@negocio.com', name: 'Ana Pérez', password: 'correct horse battery' };

describe('signOutController', () => {
    it('ends the session for a signed-in Usuario', async () => {
        const { sessionId } = await signUpController(valid);

        await signOutController(sessionId);

        await expect(getCurrentUserController(sessionId)).rejects.toBeInstanceOf(UnauthenticatedError);
    });

    it('throws UnauthenticatedError when there is no session id', async () => {
        await expect(signOutController(undefined)).rejects.toBeInstanceOf(UnauthenticatedError);
    });

    it('throws UnauthenticatedError for an already-closed session', async () => {
        const { sessionId } = await signUpController({ ...valid, email: 'beto@negocio.com' });
        await signOutController(sessionId);

        await expect(signOutController(sessionId)).rejects.toBeInstanceOf(UnauthenticatedError);
    });
});
