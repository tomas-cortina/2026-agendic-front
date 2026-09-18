import { verifyEmailUseCase } from '@/src/application/use-cases/auth/verify-email.use-case';
import { authWith, instrumentation } from '@/tests/unit/stubs';

const email = 'ana@negocio.com';
const code = 'A1B2C3';
const session = { id: 'session-123', expiresAt: new Date('2026-10-14T00:00:00.000Z') };

// No failure cases: the use case has no branch of its own, and the 410/400 mapping is the adapter's test.
describe('verifyEmailUseCase', () => {
    it('returns the Sesión the back issued for the Código de verificación', async () => {
        const verifyEmail = jest.fn().mockResolvedValue(session);

        await expect(
            verifyEmailUseCase(instrumentation, authWith({ verifyEmail }))({ email, code }),
        ).resolves.toEqual(session);
        expect(verifyEmail).toHaveBeenCalledWith(email, code);
    });
});
