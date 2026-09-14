import { EmailTakenError } from '@/src/entities/errors/auth';
import type { Session } from '@/src/entities/models/session';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

export type ISignUpUseCase = ReturnType<typeof signUpUseCase>;
export const signUpUseCase =
    (
        instrumentationService: IInstrumentationService,
        authenticationService: IAuthenticationService,
        usersRepository: IUsersRepository,
    ) =>
    (input: { email: string; name: string; password: string }): Promise<Session> =>
        instrumentationService.startSpan({ name: 'signUp Use Case', op: 'function' }, async () => {
            if (await usersRepository.getUserByEmail(input.email)) {
                throw new EmailTakenError('Email is already registered');
            }
            const user = await usersRepository.createUser({
                email: input.email,
                name: input.name,
                passwordHash: await authenticationService.hashPassword(input.password),
            });
            return authenticationService.createSession(user);
        });
