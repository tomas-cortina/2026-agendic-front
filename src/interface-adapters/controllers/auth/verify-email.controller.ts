import { z } from 'zod';
import { InputParseError } from '@/src/entities/errors/common';
import type { Session } from '@/src/entities/models/session';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IVerifyEmailUseCase } from '@/src/application/use-cases/auth/verify-email.use-case';

function presenter(session: Session, instrumentationService: IInstrumentationService) {
    return instrumentationService.startSpan({ name: 'verifyEmail Presenter', op: 'serialize' }, () => ({
        sessionId: session.id,
        expiresAt: session.expiresAt,
    }));
}

// Only emptiness is checked: the token's shape is the back's secret, and it alone can tell a forgery.
const inputSchema = z.object({ token: z.string().min(1) });

export type IVerifyEmailController = ReturnType<typeof verifyEmailController>;
// No authentication step: the Link de verificación opens the first Sesión.
export const verifyEmailController =
    (instrumentationService: IInstrumentationService, verifyEmailUseCase: IVerifyEmailUseCase) =>
    async (input: Partial<z.infer<typeof inputSchema>>): Promise<ReturnType<typeof presenter>> =>
        instrumentationService.startSpan({ name: 'verifyEmail Controller' }, async () => {
            const { data, error } = inputSchema.safeParse(input);
            if (error) throw new InputParseError('Invalid data', { cause: error });
            return presenter(await verifyEmailUseCase(data), instrumentationService);
        });
