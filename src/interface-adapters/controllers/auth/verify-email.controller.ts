import { z } from 'zod';
import { InputParseError } from '@/src/entities/errors/common';
import type { Session } from '@/src/entities/models/session';
import { userSchema } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IVerifyEmailUseCase } from '@/src/application/use-cases/auth/verify-email.use-case';

function presenter(session: Session, instrumentationService: IInstrumentationService) {
    return instrumentationService.startSpan({ name: 'verifyEmail Presenter', op: 'serialize' }, () => ({
        sessionId: session.id,
        expiresAt: session.expiresAt,
    }));
}

// The shape is checked (6 alphanumeric characters); whether it's the *right* code is still the back's call.
const inputSchema = userSchema.pick({ email: true }).extend({
    code: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^[A-Z0-9]{6}$/),
});

export type IVerifyEmailController = ReturnType<typeof verifyEmailController>;
// No authentication step: the Código de verificación opens the first Sesión.
export const verifyEmailController =
    (instrumentationService: IInstrumentationService, verifyEmailUseCase: IVerifyEmailUseCase) =>
    async (input: Partial<z.infer<typeof inputSchema>>): Promise<ReturnType<typeof presenter>> =>
        instrumentationService.startSpan({ name: 'verifyEmail Controller' }, async () => {
            const { data, error } = inputSchema.safeParse(input);
            if (error) throw new InputParseError('Invalid data', { cause: error });
            return presenter(await verifyEmailUseCase(data), instrumentationService);
        });
