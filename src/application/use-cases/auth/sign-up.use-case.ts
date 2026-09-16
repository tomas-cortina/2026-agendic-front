import type { CreateUser } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type ISignUpUseCase = ReturnType<typeof signUpUseCase>;
export const signUpUseCase =
    (instrumentationService: IInstrumentationService, authenticationService: IAuthenticationService) =>
    (input: CreateUser): Promise<void> =>
        instrumentationService.startSpan({ name: 'signUp Use Case', op: 'function' }, () =>
            authenticationService.signUp(input),
        );
