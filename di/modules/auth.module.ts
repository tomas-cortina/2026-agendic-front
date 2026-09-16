import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '@/di/types';
import { resolveSignUpMethodUseCase } from '@/src/application/use-cases/auth/resolve-sign-up-method.use-case';
import { signInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { signOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';
import { signUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { verifyEmailUseCase } from '@/src/application/use-cases/auth/verify-email.use-case';
import { AuthenticationService } from '@/src/infrastructure/services/authentication.service';
import { getCurrentUserController } from '@/src/interface-adapters/controllers/auth/get-current-user.controller';
import { resolveSignUpMethodController } from '@/src/interface-adapters/controllers/auth/resolve-sign-up-method.controller';
import { signInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { signOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import { signUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';
import { verifyEmailController } from '@/src/interface-adapters/controllers/auth/verify-email.controller';

export function createAuthModule() {
    const authModule = createModule();

    // Read on first use, not at import, so `next build` doesn't need the back's URL.
    authModule.bind(DI_SYMBOLS.IAuthenticationService).toFactory(() => {
        const apiBaseUrl = process.env.API_BASE_URL;
        if (!apiBaseUrl) throw new Error('API_BASE_URL is not set');
        return new AuthenticationService(apiBaseUrl);
    });

    authModule
        .bind(DI_SYMBOLS.IResolveSignUpMethodUseCase)
        .toHigherOrderFunction(resolveSignUpMethodUseCase, [DI_SYMBOLS.IInstrumentationService]);

    authModule
        .bind(DI_SYMBOLS.ISignUpUseCase)
        .toHigherOrderFunction(signUpUseCase, [DI_SYMBOLS.IInstrumentationService, DI_SYMBOLS.IAuthenticationService]);

    authModule
        .bind(DI_SYMBOLS.ISignInUseCase)
        .toHigherOrderFunction(signInUseCase, [DI_SYMBOLS.IInstrumentationService, DI_SYMBOLS.IAuthenticationService]);

    authModule
        .bind(DI_SYMBOLS.ISignOutUseCase)
        .toHigherOrderFunction(signOutUseCase, [DI_SYMBOLS.IInstrumentationService, DI_SYMBOLS.IAuthenticationService]);

    authModule
        .bind(DI_SYMBOLS.IVerifyEmailUseCase)
        .toHigherOrderFunction(verifyEmailUseCase, [
            DI_SYMBOLS.IInstrumentationService,
            DI_SYMBOLS.IAuthenticationService,
        ]);

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
        .toHigherOrderFunction(signOutController, [DI_SYMBOLS.IInstrumentationService, DI_SYMBOLS.ISignOutUseCase]);

    authModule
        .bind(DI_SYMBOLS.IVerifyEmailController)
        .toHigherOrderFunction(verifyEmailController, [
            DI_SYMBOLS.IInstrumentationService,
            DI_SYMBOLS.IVerifyEmailUseCase,
        ]);

    return authModule;
}
