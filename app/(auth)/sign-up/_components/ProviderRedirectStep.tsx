import type { Provider } from '@/src/entities/models/sign-up-method';
import { PROVIDER_LABEL, ProviderButton } from './ProviderButton';
import { StepShell } from './StepShell';

export function ProviderRedirectStep({
    provider,
    email,
    onBack,
}: {
    provider: Provider;
    email: string;
    onBack: () => void;
}) {
    const label = PROVIDER_LABEL[provider];

    return (
        <StepShell
            title={`Continuá con ${label}`}
            subtitle={`${email} es una cuenta de ${label}. Registrate con ${label} para sincronizar tu agenda automáticamente.`}
        >
            <ProviderButton provider={provider} className="mb-3.5" />

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
