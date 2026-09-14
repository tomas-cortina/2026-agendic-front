import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

export class MockCrashReporterService implements ICrashReporterService {
    readonly reported: unknown[] = [];

    report(error: unknown): string {
        this.reported.push(error);
        return String(this.reported.length);
    }
}
