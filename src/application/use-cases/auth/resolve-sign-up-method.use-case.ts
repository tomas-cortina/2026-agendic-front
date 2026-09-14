import type { Provider } from '@/src/entities/models/provider';
import type { SignUpMethod } from '@/src/entities/models/sign-up-method';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

// Intentionally empty: OAuth sign-up is out of scope for now, so every email
// falls through to 'password'. Left populated by a future ticket instead of
// deleted, so the domain-matching logic below has a map to read from again.
const PROVIDER_BY_DOMAIN: Record<string, Provider> = {};

export type IResolveSignUpMethodUseCase = ReturnType<typeof resolveSignUpMethodUseCase>;
export const resolveSignUpMethodUseCase =
    (instrumentationService: IInstrumentationService) =>
    (input: { email: string }): SignUpMethod =>
        instrumentationService.startSpan({ name: 'resolveSignUpMethod Use Case', op: 'function' }, () => {
            const domain = input.email.split('@')[1]?.toLowerCase() ?? '';
            return PROVIDER_BY_DOMAIN[domain] ?? 'password';
        });
