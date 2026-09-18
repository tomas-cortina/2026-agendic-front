'use client';

import { useState } from 'react';
import { Input } from '@/app/_components/ui/input';
import { ResendVerificationButton } from './ResendVerificationButton';
import { StepShell } from './StepShell';

export type VerificationReason = 'expired' | 'invalid';

const MESSAGE: Record<VerificationReason, string> = {
    expired: 'Tu link de verificación venció.',
    invalid: 'Ese link de verificación no es válido.',
};

export function VerificationErrorStep({ reason }: { reason: VerificationReason }) {
    const [email, setEmail] = useState('');

    return (
        <StepShell title="Link de verificación">
            <p className="text-[14px] text-muted-foreground leading-[1.6] mb-5">
                {MESSAGE[reason]} Ingresá tu email para pedir uno nuevo.
            </p>
            <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vos@tunegocio.com"
                aria-label="Email"
                className="h-auto px-3.5 py-3 rounded-lg mb-3.5"
            />
            <ResendVerificationButton email={email} />
        </StepShell>
    );
}
