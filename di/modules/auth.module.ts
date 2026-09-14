import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '@/di/types';
import { resolveSignUpMethodUseCase } from '@/src/application/use-cases/auth/resolve-sign-up-method.use-case';
import { resolveSignUpMethodController } from '@/src/interface-adapters/controllers/auth/resolve-sign-up-method.controller';

export function createAuthModule() {
    const authModule = createModule();

    authModule
        .bind(DI_SYMBOLS.IResolveSignUpMethodUseCase)
        .toHigherOrderFunction(resolveSignUpMethodUseCase, [DI_SYMBOLS.IInstrumentationService]);

    authModule
        .bind(DI_SYMBOLS.IResolveSignUpMethodController)
        .toHigherOrderFunction(resolveSignUpMethodController, [
            DI_SYMBOLS.IInstrumentationService,
            DI_SYMBOLS.IResolveSignUpMethodUseCase,
        ]);

    return authModule;
}
