import { z } from 'zod';
import { InputParseError } from '@/src/entities/errors/common';
import { createUserSchema } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';

const inputSchema = createUserSchema;

export type ISignUpController = ReturnType<typeof signUpController>;
// No authentication step: sign-up happens before any session exists.
// No presenter: sign-up no longer returns a Sesión or anything else to shape for the client, so
// there's nothing to whitelist. This deliberately departs from the "returns ReturnType<typeof presenter>" rule.
export const signUpController =
    (instrumentationService: IInstrumentationService, signUpUseCase: ISignUpUseCase) =>
    async (input: Partial<z.infer<typeof inputSchema>>): Promise<void> =>
        instrumentationService.startSpan({ name: 'signUp Controller' }, async () => {
            const { data, error } = inputSchema.safeParse(input);
            if (error) throw new InputParseError('Invalid data', { cause: error });
            await signUpUseCase(data);
        });
