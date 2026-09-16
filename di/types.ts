import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IResolveSignUpMethodUseCase } from '@/src/application/use-cases/auth/resolve-sign-up-method.use-case';
import type { ISignInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import type { ISignOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';
import type { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import type { IVerifyEmailUseCase } from '@/src/application/use-cases/auth/verify-email.use-case';
import type { IGetCurrentUserController } from '@/src/interface-adapters/controllers/auth/get-current-user.controller';
import type { IResolveSignUpMethodController } from '@/src/interface-adapters/controllers/auth/resolve-sign-up-method.controller';
import type { ISignInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import type { ISignOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import type { ISignUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';
import type { IVerifyEmailController } from '@/src/interface-adapters/controllers/auth/verify-email.controller';

export const DI_SYMBOLS = {
    // Services
    IInstrumentationService: Symbol.for('IInstrumentationService'),
    ICrashReporterService: Symbol.for('ICrashReporterService'),
    IAuthenticationService: Symbol.for('IAuthenticationService'),

    // Use cases
    IResolveSignUpMethodUseCase: Symbol.for('IResolveSignUpMethodUseCase'),
    ISignUpUseCase: Symbol.for('ISignUpUseCase'),
    ISignInUseCase: Symbol.for('ISignInUseCase'),
    ISignOutUseCase: Symbol.for('ISignOutUseCase'),
    IVerifyEmailUseCase: Symbol.for('IVerifyEmailUseCase'),

    // Controllers
    IResolveSignUpMethodController: Symbol.for('IResolveSignUpMethodController'),
    ISignUpController: Symbol.for('ISignUpController'),
    ISignInController: Symbol.for('ISignInController'),
    IGetCurrentUserController: Symbol.for('IGetCurrentUserController'),
    ISignOutController: Symbol.for('ISignOutController'),
    IVerifyEmailController: Symbol.for('IVerifyEmailController'),
};

export interface DI_RETURN_TYPES {
    // Services
    IInstrumentationService: IInstrumentationService;
    ICrashReporterService: ICrashReporterService;
    IAuthenticationService: IAuthenticationService;

    // Use cases
    IResolveSignUpMethodUseCase: IResolveSignUpMethodUseCase;
    ISignUpUseCase: ISignUpUseCase;
    ISignInUseCase: ISignInUseCase;
    ISignOutUseCase: ISignOutUseCase;
    IVerifyEmailUseCase: IVerifyEmailUseCase;

    // Controllers
    IResolveSignUpMethodController: IResolveSignUpMethodController;
    ISignUpController: ISignUpController;
    ISignInController: ISignInController;
    IGetCurrentUserController: IGetCurrentUserController;
    ISignOutController: ISignOutController;
    IVerifyEmailController: IVerifyEmailController;
}
