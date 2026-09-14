import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { StepShell } from './StepShell';

const providerButtonClass =
    'text-[14px] font-semibold text-foreground bg-white border-[1.5px] border-[#d6dbe6] px-4.5 py-[11px] rounded-[10px] hover:bg-gray-50 transition-colors h-auto';

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
        <StepShell>
            <div className="text-[28px] font-extrabold mb-1.5 text-foreground">
                Creá tu cuenta gratis
            </div>
            <div className="text-[14px] text-muted-foreground mb-6">
                No necesitás tarjeta. Ampliás cuando quieras.
            </div>

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

                {error && (
                    <p
                        aria-live="polite"
                        className="text-[13px] text-destructive -mt-2.5 mb-4.5"
                    >
                        {error}
                    </p>
                )}

                <div className="flex items-center gap-2.5 text-muted-foreground text-[12px] mb-4.5">
                    <div className="flex-1 h-px bg-border" />
                    o
                    <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex flex-col gap-2.5 mb-4.5">
                    <Button type="button" variant="outline" className={providerButtonClass}>
                        Continuar con Google
                    </Button>
                    <Button type="button" variant="outline" className={providerButtonClass}>
                        Continuar con Microsoft
                    </Button>
                </div>

                <div className="text-[12.5px] text-muted-foreground leading-[1.45]">
                    Al continuar con Google o Microsoft, sincronizás tu agenda
                    automáticamente.
                </div>
            </form>
        </StepShell>
    );
}
