import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/src/entities/errors/auth';

const signUpController = getInjection('ISignUpController');
const getCurrentUserController = getInjection('IGetCurrentUserController');

const valid = { email: 'ana@negocio.com', name: 'Ana Pérez', password: 'correct horse battery' };

afterEach(() => jest.useRealTimers());

describe('getCurrentUserController', () => {
    it('returns the name for a valid session', async () => {
        const { sessionId } = await signUpController(valid);

        await expect(getCurrentUserController(sessionId)).resolves.toEqual({ name: valid.name });
    });

    it('throws UnauthenticatedError when there is no session id', async () => {
        await expect(getCurrentUserController(undefined)).rejects.toBeInstanceOf(UnauthenticatedError);
    });

    it('throws UnauthenticatedError for an unknown session id', async () => {
        await expect(getCurrentUserController(crypto.randomUUID())).rejects.toBeInstanceOf(UnauthenticatedError);
    });

    it('throws UnauthenticatedError for an expired session', async () => {
        const { sessionId, expiresAt } = await signUpController({ ...valid, email: 'beto@negocio.com' });

        jest.useFakeTimers({ now: expiresAt.getTime() + 1 });
        await expect(getCurrentUserController(sessionId)).rejects.toBeInstanceOf(UnauthenticatedError);
    });
});
