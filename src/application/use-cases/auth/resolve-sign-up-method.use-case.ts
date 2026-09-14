import type { Provider } from '@/src/entities/models/provider';
import type { SignUpMethod } from '@/src/entities/models/sign-up-method';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

const PROVIDER_BY_DOMAIN: Record<string, Provider> = {
    'gmail.com': 'google',
    'googlemail.com': 'google',
    'outlook.com': 'microsoft',
    'hotmail.com': 'microsoft',
    'live.com': 'microsoft',
    'msn.com': 'microsoft',
};

export type IResolveSignUpMethodUseCase = ReturnType<typeof resolveSignUpMethodUseCase>;
export const resolveSignUpMethodUseCase =
    (instrumentationService: IInstrumentationService) =>
    (input: { email: string }): SignUpMethod =>
        instrumentationService.startSpan({ name: 'resolveSignUpMethod Use Case', op: 'function' }, () => {
            const domain = input.email.split('@')[1]?.toLowerCase() ?? '';
            return PROVIDER_BY_DOMAIN[domain] ?? 'password';
        });
