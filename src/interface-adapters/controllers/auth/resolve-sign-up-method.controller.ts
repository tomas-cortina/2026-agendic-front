import { z } from 'zod';
import { InputParseError } from '@/src/entities/errors/common';
import type { SignUpMethod } from '@/src/entities/models/sign-up-method';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IResolveSignUpMethodUseCase } from '@/src/application/use-cases/auth/resolve-sign-up-method.use-case';

function presenter(method: SignUpMethod, instrumentationService: IInstrumentationService) {
    return instrumentationService.startSpan({ name: 'resolveSignUpMethod Presenter', op: 'serialize' }, () => ({
        method,
    }));
}

const inputSchema = z.object({ email: z.email() });

export type IResolveSignUpMethodController = ReturnType<typeof resolveSignUpMethodController>;
// No authentication step: sign-up happens before any session exists.
export const resolveSignUpMethodController =
    (instrumentationService: IInstrumentationService, resolveSignUpMethodUseCase: IResolveSignUpMethodUseCase) =>
    async (input: Partial<z.infer<typeof inputSchema>>): Promise<ReturnType<typeof presenter>> =>
        instrumentationService.startSpan({ name: 'resolveSignUpMethod Controller' }, async () => {
            const { data, error } = inputSchema.safeParse(input);
            if (error) throw new InputParseError('Invalid data', { cause: error });
            return presenter(resolveSignUpMethodUseCase({ email: data.email }), instrumentationService);
        });
