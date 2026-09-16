import { StepShell } from './StepShell';

// No "reenviar" button yet: that lands in a later ticket.
export function CheckEmailStep({ email }: { email: string }) {
    return (
        <StepShell title="Revisá tu mail">
            <p className="text-[14px] text-muted-foreground leading-[1.6]">
                Te mandamos un mail a <span className="font-semibold text-foreground">{email}</span>. Abrí el link de
                verificación para entrar a tu cuenta.
            </p>
        </StepShell>
    );
}
