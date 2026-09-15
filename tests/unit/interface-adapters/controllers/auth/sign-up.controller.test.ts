import { EmailTakenError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { signUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';
import { instrumentation } from '@/tests/unit/stubs';

const valid = { email: 'ana@negocio.com', name: 'Ana Pérez', password: 'correct horse battery' };
const session = { id: 'session-123', expiresAt: new Date('2026-10-14T00:00:00.000Z') };

// No "unauthenticated" case: sign-up happens before any session exists.
describe('signUpController', () => {
    it('returns the new session', async () => {
        const signUpUseCase = jest.fn().mockResolvedValue(session);

        await expect(signUpController(instrumentation, signUpUseCase)(valid)).resolves.toEqual({
            sessionId: 'session-123',
            expiresAt: session.expiresAt,
        });
        expect(signUpUseCase).toHaveBeenCalledWith(valid);
    });

    it('lowercases the email before signing up', async () => {
        const signUpUseCase = jest.fn().mockResolvedValue(session);

        await signUpController(instrumentation, signUpUseCase)({ ...valid, email: 'Ana@Negocio.com' });

        expect(signUpUseCase).toHaveBeenCalledWith(expect.objectContaining({ email: 'ana@negocio.com' }));
    });

    it('throws EmailTakenError when the email is already registered', async () => {
        const signUpUseCase = jest.fn().mockRejectedValue(new EmailTakenError('Email is already registered'));

        await expect(signUpController(instrumentation, signUpUseCase)(valid)).rejects.toBeInstanceOf(EmailTakenError);
    });

    it.each([
        ['the email is malformed', { ...valid, email: 'ana' }],
        ['the name is blank', { ...valid, name: '   ' }],
        ['the password is shorter than 12 characters', { ...valid, password: 'short' }],
        ['the password is longer than 72 characters', { ...valid, password: 'a'.repeat(73) }],
        ['every field is missing', {}],
    ])('throws InputParseError when %s', async (_, input) => {
        const signUpUseCase = jest.fn();

        await expect(signUpController(instrumentation, signUpUseCase)(input)).rejects.toBeInstanceOf(InputParseError);
        expect(signUpUseCase).not.toHaveBeenCalled();
    });
});
