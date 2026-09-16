import { ResendVerificationButton } from './ResendVerificationButton';
import { StepShell } from './StepShell';

export function CheckEmailStep({ email }: { email: string }) {
    return (
        <StepShell title="Revisá tu mail">
            <p className="text-[14px] text-muted-foreground leading-[1.6] mb-5">
                Te mandamos un mail a <span className="font-semibold text-foreground">{email}</span>. Abrí el link de
                verificación para entrar a tu cuenta.
            </p>
            <ResendVerificationButton email={email} />
        </StepShell>
    );
}
