import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import type { Provider } from '@/src/entities/models/sign-up-method';
import { PROVIDER_LABEL, ProviderButton } from './ProviderButton';
import { FormError, StepShell } from './StepShell';

// Derived from the typed label map (not providerSchema) to keep zod out of the client bundle.
const PROVIDERS = Object.keys(PROVIDER_LABEL) as Provider[];

export function EmailStep({
    email,
    onEmailChange,
    onSubmit,
    pending,
    error,
}: {
    email: string;
    onEmailChange: (email: string) => void;
    onSubmit: () => void;
    pending: boolean;
    error?: string;
}) {
    return (
        <StepShell
            title="Creá tu cuenta gratis"
            subtitle="No necesitás tarjeta. Ampliás cuando quieras."
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
                className="flex flex-col"
            >
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    placeholder="vos@tunegocio.com"
                    aria-label="Email"
                    className="h-auto px-3.5 py-3 rounded-lg mb-3.5"
                />

                <Button
                    type="submit"
                    disabled={pending}
                    className="text-[14px] font-bold text-white bg-foreground px-4.5 py-3 rounded-[10px] hover:bg-foreground/90 transition-colors h-auto mb-4.5"
                >
                    {pending ? 'Verificando…' : 'Continuar con email'}
                </Button>

                <FormError message={error} />

                <div className="flex items-center gap-2.5 text-muted-foreground text-[12px] mb-4.5">
                    <div className="flex-1 h-px bg-border" />
                    o
                    <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex flex-col gap-2.5 mb-4.5">
                    {PROVIDERS.map((provider) => (
                        <ProviderButton key={provider} provider={provider} />
                    ))}
                </div>

                <div className="text-[12.5px] text-muted-foreground leading-[1.45]">
                    Al continuar con Google o Microsoft, sincronizás tu agenda
                    automáticamente.
                </div>
            </form>
        </StepShell>
    );
}
