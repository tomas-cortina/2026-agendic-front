import { VerificationCodeExpiredError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { verifyEmailController } from '@/src/interface-adapters/controllers/auth/verify-email.controller';
import { instrumentation } from '@/tests/unit/stubs';

const email = 'ana@negocio.com';
const code = 'A1B2C3';
const session = { id: 'session-123', expiresAt: new Date('2026-10-14T00:00:00.000Z') };

// No "unauthenticated" case: the Código de verificación opens the first Sesión.
describe('verifyEmailController', () => {
    it('returns a new session for a valid code', async () => {
        const verifyEmailUseCase = jest.fn().mockResolvedValue(session);

        await expect(
            verifyEmailController(instrumentation, verifyEmailUseCase)({ email, code }),
        ).resolves.toEqual({
            sessionId: 'session-123',
            expiresAt: session.expiresAt,
        });
        expect(verifyEmailUseCase).toHaveBeenCalledWith({ email, code });
    });

    it('normalizes a lowercase code with surrounding whitespace before calling the use case', async () => {
        const verifyEmailUseCase = jest.fn().mockResolvedValue(session);

        await verifyEmailController(instrumentation, verifyEmailUseCase)({ email, code: '  a1b2c3  ' });

        expect(verifyEmailUseCase).toHaveBeenCalledWith({ email, code });
    });

    it('throws VerificationCodeExpiredError when the back rejects the code as expired', async () => {
        const verifyEmailUseCase = jest.fn().mockRejectedValue(new VerificationCodeExpiredError('Expired'));

        await expect(
            verifyEmailController(instrumentation, verifyEmailUseCase)({ email, code }),
        ).rejects.toBeInstanceOf(VerificationCodeExpiredError);
    });

    it.each([
        ['the email is invalid', { email: 'not-an-email', code }],
        ['the email is missing', { code }],
        ['the code is missing', { email }],
        ['the code is shorter than 6 characters', { email, code: 'A1B2C' }],
        ['the code is longer than 6 characters', { email, code: 'A1B2C33' }],
        ['the code has non-alphanumeric characters', { email, code: 'A1B2C!' }],
    ])('throws InputParseError when %s', async (_, input) => {
        const verifyEmailUseCase = jest.fn();

        await expect(verifyEmailController(instrumentation, verifyEmailUseCase)(input)).rejects.toBeInstanceOf(
            InputParseError,
        );
        expect(verifyEmailUseCase).not.toHaveBeenCalled();
    });
});
