import { z } from 'zod';
import { InputParseError } from '@/src/entities/errors/common';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IResendVerificationUseCase } from '@/src/application/use-cases/auth/resend-verification.use-case';

const inputSchema = z.object({ email: z.email() });

export type IResendVerificationController = ReturnType<typeof resendVerificationController>;
// No authentication step: a Registro pendiente has no Sesión yet to authenticate with.
export const resendVerificationController =
    (instrumentationService: IInstrumentationService, resendVerificationUseCase: IResendVerificationUseCase) =>
    async (input: Partial<z.infer<typeof inputSchema>>): Promise<void> =>
        instrumentationService.startSpan({ name: 'resendVerification Controller' }, async () => {
            const { data, error } = inputSchema.safeParse(input);
            if (error) throw new InputParseError('Invalid data', { cause: error });
            await resendVerificationUseCase({ email: data.email });
        });
