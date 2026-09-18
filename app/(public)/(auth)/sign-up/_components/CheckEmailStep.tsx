'use client';

import { useActionState } from 'react';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { verifyEmail, type VerifyEmailState } from '../actions';
import { FormError } from './FormError';
import { ResendVerificationButton } from './ResendVerificationButton';
import { StepShell } from './StepShell';

const initialState: VerifyEmailState = {};

export function CheckEmailStep({ email }: { email: string }) {
    const [state, formAction, pending] = useActionState(verifyEmail, initialState);

    return (
        <StepShell title="Revisá tu mail">
            <p className="text-[14px] text-muted-foreground leading-[1.6] mb-5">
                Te mandamos un código de 6 caracteres a <span className="font-semibold text-foreground">{email}</span>.
                Ingresalo para entrar a tu cuenta.
            </p>
            <form action={formAction} className="flex flex-col mb-3.5">
                <input type="hidden" name="email" value={email} />
                <Input
                    name="code"
                    maxLength={6}
                    autoComplete="one-time-code"
                    autoFocus
                    required
                    placeholder="A1B2C3"
                    aria-label="Código de verificación"
                    className="h-auto px-3.5 py-3 rounded-lg mb-3.5 uppercase tracking-[0.4em] text-center"
                />
                <FormError message={state.error} />
                <Button
                    type="submit"
                    disabled={pending}
                    className="text-[14.5px] font-bold text-white bg-primary px-6.5 py-3 rounded-full hover:bg-primary/90 transition-colors h-auto"
                >
                    {pending ? 'Verificando…' : 'Verificar'}
                </Button>
            </form>
            <ResendVerificationButton email={email} />
        </StepShell>
    );
}
