import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '@/di/types';
import { resolveSignUpMethodUseCase } from '@/src/application/use-cases/auth/resolve-sign-up-method.use-case';
import { signInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { signOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';
import { signUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { MockUsersRepository } from '@/src/infrastructure/repositories/users.repository.mock';
import { AuthenticationService } from '@/src/infrastructure/services/authentication.service';
import { MockAuthenticationService } from '@/src/infrastructure/services/authentication.service.mock';
import { getCurrentUserController } from '@/src/interface-adapters/controllers/auth/get-current-user.controller';
import { resolveSignUpMethodController } from '@/src/interface-adapters/controllers/auth/resolve-sign-up-method.controller';
import { signInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { signOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import { signUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';

export function createAuthModule() {
    const authModule = createModule();

    if (process.env.NODE_ENV === 'test') {
        authModule
            .bind(DI_SYMBOLS.IAuthenticationService)
            .toClass(MockAuthenticationService, [DI_SYMBOLS.IUsersRepository]);
    } else {
        authModule.bind(DI_SYMBOLS.IAuthenticationService).toClass(AuthenticationService, [DI_SYMBOLS.IUsersRepository]);
    }

    // ponytail: no real users repository until there is a database, so the mock serves every env (ADR 0001)
    authModule.bind(DI_SYMBOLS.IUsersRepository).toClass(MockUsersRepository);

    authModule
        .bind(DI_SYMBOLS.IResolveSignUpMethodUseCase)
        .toHigherOrderFunction(resolveSignUpMethodUseCase, [DI_SYMBOLS.IInstrumentationService]);

    authModule
        .bind(DI_SYMBOLS.ISignUpUseCase)
        .toHigherOrderFunction(signUpUseCase, [
            DI_SYMBOLS.IInstrumentationService,
            DI_SYMBOLS.IAuthenticationService,
            DI_SYMBOLS.IUsersRepository,
        ]);

    authModule
        .bind(DI_SYMBOLS.ISignInUseCase)
        .toHigherOrderFunction(signInUseCase, [
            DI_SYMBOLS.IInstrumentationService,
            DI_SYMBOLS.IAuthenticationService,
            DI_SYMBOLS.IUsersRepository,
        ]);

    authModule
        .bind(DI_SYMBOLS.ISignOutUseCase)
        .toHigherOrderFunction(signOutUseCase, [DI_SYMBOLS.IInstrumentationService, DI_SYMBOLS.IAuthenticationService]);

    authModule
        .bind(DI_SYMBOLS.IResolveSignUpMethodController)
        .toHigherOrderFunction(resolveSignUpMethodController, [
            DI_SYMBOLS.IInstrumentationService,
            DI_SYMBOLS.IResolveSignUpMethodUseCase,
        ]);

    authModule
        .bind(DI_SYMBOLS.ISignUpController)
        .toHigherOrderFunction(signUpController, [DI_SYMBOLS.IInstrumentationService, DI_SYMBOLS.ISignUpUseCase]);

    authModule
        .bind(DI_SYMBOLS.ISignInController)
        .toHigherOrderFunction(signInController, [DI_SYMBOLS.IInstrumentationService, DI_SYMBOLS.ISignInUseCase]);

    authModule
        .bind(DI_SYMBOLS.IGetCurrentUserController)
        .toHigherOrderFunction(getCurrentUserController, [
            DI_SYMBOLS.IInstrumentationService,
            DI_SYMBOLS.IAuthenticationService,
        ]);

    authModule
        .bind(DI_SYMBOLS.ISignOutController)
        .toHigherOrderFunction(signOutController, [
            DI_SYMBOLS.IInstrumentationService,
            DI_SYMBOLS.IAuthenticationService,
            DI_SYMBOLS.ISignOutUseCase,
        ]);

    return authModule;
}
