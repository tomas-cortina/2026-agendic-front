import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export class MockInstrumentationService implements IInstrumentationService {
    startSpan<T>(_options: { name: string; op?: string }, callback: () => T): T {
        return callback();
    }
}
