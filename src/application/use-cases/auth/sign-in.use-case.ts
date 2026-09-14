import { AuthenticationError } from '@/src/entities/errors/auth';
import type { Session } from '@/src/entities/models/session';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

export type ISignInUseCase = ReturnType<typeof signInUseCase>;
export const signInUseCase =
    (
        instrumentationService: IInstrumentationService,
        authenticationService: IAuthenticationService,
        usersRepository: IUsersRepository,
    ) =>
    (input: { email: string; password: string }): Promise<Session> =>
        instrumentationService.startSpan({ name: 'signIn Use Case', op: 'function' }, async () => {
            const user = await usersRepository.getUserByEmail(input.email);
            if (!user || !(await authenticationService.verifyPassword(input.password, user.passwordHash))) {
                throw new AuthenticationError('Invalid email or password');
            }
            return authenticationService.createSession(user);
        });
