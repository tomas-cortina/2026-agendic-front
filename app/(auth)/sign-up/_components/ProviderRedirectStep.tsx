import { Button } from '@/app/_components/ui/button';
import type { SignUpMethod } from '@/src/entities/models/sign-up-method';
import { StepShell } from './StepShell';

const PROVIDER_LABEL = { google: 'Google', microsoft: 'Microsoft' } as const;

export function ProviderRedirectStep({
    provider,
    email,
    onBack,
}: {
    provider: Exclude<SignUpMethod, 'password'>;
    email: string;
    onBack: () => void;
}) {
    const label = PROVIDER_LABEL[provider];

    return (
        <StepShell>
            <div className="text-[28px] font-extrabold mb-1.5 text-foreground">
                Continuá con {label}
            </div>
            <div className="text-[14px] text-muted-foreground mb-6">
                {email} es una cuenta de {label}. Registrate con {label} para
                sincronizar tu agenda automáticamente.
            </div>

            <Button
                type="button"
                variant="outline"
                className="text-[14px] font-semibold text-foreground bg-white border-[1.5px] border-[#d6dbe6] px-4.5 py-[11px] rounded-[10px] hover:bg-gray-50 transition-colors h-auto mb-3.5"
            >
                Continuar con {label}
            </Button>

            <button
                type="button"
                onClick={onBack}
                className="text-[13px] text-muted-foreground hover:text-primary transition-colors"
            >
                Usar otro email
            </button>
        </StepShell>
    );
}
