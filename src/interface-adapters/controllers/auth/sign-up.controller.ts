import { z } from 'zod';
import { InputParseError } from '@/src/entities/errors/common';
import type { Session } from '@/src/entities/models/session';
import { createUserSchema } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';

function presenter(session: Session, instrumentationService: IInstrumentationService) {
    return instrumentationService.startSpan({ name: 'signUp Presenter', op: 'serialize' }, () => ({
        sessionId: session.id,
        expiresAt: session.expiresAt,
    }));
}

const inputSchema = createUserSchema;

export type ISignUpController = ReturnType<typeof signUpController>;
// No authentication step: sign-up happens before any session exists.
export const signUpController =
    (instrumentationService: IInstrumentationService, signUpUseCase: ISignUpUseCase) =>
    async (input: Partial<z.infer<typeof inputSchema>>): Promise<ReturnType<typeof presenter>> =>
        instrumentationService.startSpan({ name: 'signUp Controller' }, async () => {
            const { data, error } = inputSchema.safeParse(input);
            if (error) throw new InputParseError('Invalid data', { cause: error });
            return presenter(await signUpUseCase(data), instrumentationService);
        });
