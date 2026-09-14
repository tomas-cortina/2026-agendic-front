import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IResolveSignUpMethodUseCase } from '@/src/application/use-cases/auth/resolve-sign-up-method.use-case';
import type { IResolveSignUpMethodController } from '@/src/interface-adapters/controllers/auth/resolve-sign-up-method.controller';

export const DI_SYMBOLS = {
    // Services
    IInstrumentationService: Symbol.for('IInstrumentationService'),
    ICrashReporterService: Symbol.for('ICrashReporterService'),

    // Use cases
    IResolveSignUpMethodUseCase: Symbol.for('IResolveSignUpMethodUseCase'),

    // Controllers
    IResolveSignUpMethodController: Symbol.for('IResolveSignUpMethodController'),
};

export interface DI_RETURN_TYPES {
    // Services
    IInstrumentationService: IInstrumentationService;
    ICrashReporterService: ICrashReporterService;

    // Use cases
    IResolveSignUpMethodUseCase: IResolveSignUpMethodUseCase;

    // Controllers
    IResolveSignUpMethodController: IResolveSignUpMethodController;
}
