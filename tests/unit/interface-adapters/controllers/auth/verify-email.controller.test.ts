import { VerificationLinkExpiredError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { verifyEmailController } from '@/src/interface-adapters/controllers/auth/verify-email.controller';
import { instrumentation } from '@/tests/unit/stubs';

const token = 'verification-token-abc';
const session = { id: 'session-123', expiresAt: new Date('2026-10-14T00:00:00.000Z') };

// No "unauthenticated" case: the Link de verificación opens the first Sesión.
describe('verifyEmailController', () => {
    it('returns a new session for a valid token', async () => {
        const verifyEmailUseCase = jest.fn().mockResolvedValue(session);

        await expect(verifyEmailController(instrumentation, verifyEmailUseCase)({ token })).resolves.toEqual({
            sessionId: 'session-123',
            expiresAt: session.expiresAt,
        });
        expect(verifyEmailUseCase).toHaveBeenCalledWith({ token });
    });

    it('throws VerificationLinkExpiredError when the back rejects the token as expired', async () => {
        const verifyEmailUseCase = jest.fn().mockRejectedValue(new VerificationLinkExpiredError('Expired'));

        await expect(verifyEmailController(instrumentation, verifyEmailUseCase)({ token })).rejects.toBeInstanceOf(
            VerificationLinkExpiredError,
        );
    });

    it.each([
        ['the token is empty', { token: '' }],
        ['the token is missing', {}],
    ])('throws InputParseError when %s', async (_, input) => {
        const verifyEmailUseCase = jest.fn();

        await expect(verifyEmailController(instrumentation, verifyEmailUseCase)(input)).rejects.toBeInstanceOf(
            InputParseError,
        );
        expect(verifyEmailUseCase).not.toHaveBeenCalled();
    });
});
