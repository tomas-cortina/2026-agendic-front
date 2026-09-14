import type { Provider } from '@/src/entities/models/provider';
import type { SignUpMethod } from '@/src/entities/models/sign-up-method';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

const PROVIDER_BY_DOMAIN: Record<string, Provider> = {};

export type IResolveSignUpMethodUseCase = ReturnType<typeof resolveSignUpMethodUseCase>;
export const resolveSignUpMethodUseCase =
    (instrumentationService: IInstrumentationService) =>
    (input: { email: string }): SignUpMethod =>
        instrumentationService.startSpan({ name: 'resolveSignUpMethod Use Case', op: 'function' }, () => {
            const domain = input.email.split('@')[1]?.toLowerCase() ?? '';
            return PROVIDER_BY_DOMAIN[domain] ?? 'password';
        });
