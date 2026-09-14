import { z } from 'zod';
import { InputParseError } from '@/src/entities/errors/common';
import type { Session } from '@/src/entities/models/session';
import { userSchema } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ISignInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';

function presenter(session: Session, instrumentationService: IInstrumentationService) {
    return instrumentationService.startSpan({ name: 'signIn Presenter', op: 'serialize' }, () => ({
        sessionId: session.id,
        expiresAt: session.expiresAt,
    }));
}

// Password rules are not re-checked here, so tightening them never locks out existing users.
const inputSchema = z.object({ email: userSchema.shape.email, password: z.string().min(1) });

export type ISignInController = ReturnType<typeof signInController>;
// No authentication step: sign-in happens before any session exists.
export const signInController =
    (instrumentationService: IInstrumentationService, signInUseCase: ISignInUseCase) =>
    async (input: Partial<z.infer<typeof inputSchema>>): Promise<ReturnType<typeof presenter>> =>
        instrumentationService.startSpan({ name: 'signIn Controller' }, async () => {
            const { data, error } = inputSchema.safeParse(input);
            if (error) throw new InputParseError('Invalid data', { cause: error });
            return presenter(await signInUseCase(data), instrumentationService);
        });
