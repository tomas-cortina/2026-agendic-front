'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/app/_components/ui/button';
import { resendVerification } from '../actions';

const COOLDOWN_SECONDS = 60;

export function ResendVerificationButton({ email }: { email: string }) {
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [error, setError] = useState<string>();
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        if (secondsLeft === 0) return;
        const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearInterval(timer);
    }, [secondsLeft]);

    function handleClick() {
        setError(undefined);
        startTransition(async () => {
            const result = await resendVerification(email);
            if (result.error) setError(result.error);
            else setSecondsLeft(COOLDOWN_SECONDS);
        });
    }

    const disabled = pending || secondsLeft > 0;

    return (
        <div>
            <Button
                type="button"
                variant="outline"
                onClick={handleClick}
                disabled={disabled}
                className="text-[13px] font-semibold h-auto px-4 py-2 rounded-lg"
            >
                {secondsLeft > 0 ? `Reenviar en ${secondsLeft}s` : 'Reenviar el link de verificación'}
            </Button>
            {error && <p className="text-[13px] text-destructive mt-2">{error}</p>}
        </div>
    );
}
