'use client';

import { useState, useTransition } from 'react';
import type { SignUpMethod } from '@/src/entities/models/sign-up-method';
import { resolveSignUpMethod } from '../actions';
import { CheckEmailStep } from './CheckEmailStep';
import { DetailsStep } from './DetailsStep';
import { EmailStep } from './EmailStep';
import { ProviderRedirectStep } from './ProviderRedirectStep';

// EmailStep and ProviderRedirectStep are client components because this file imports them; they take
// function props, so they must not become 'use client' entry points themselves. CheckEmailStep is its
// own entry point: it needs 'use client' for useActionState.
export function SignupForm() {
    const [step, setStep] = useState<'email' | SignUpMethod | 'sent'>('email');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string>();
    const [pending, startTransition] = useTransition();

    function handleEmailSubmit() {
        setError(undefined);
        startTransition(async () => {
            const result = await resolveSignUpMethod(email);
            if ('method' in result) setStep(result.method);
            else setError(result.error);
        });
    }

    if (step === 'sent') return <CheckEmailStep email={email} />;

    if (step === 'password') return <DetailsStep email={email} onSent={() => setStep('sent')} />;

    if (step !== 'email') {
        return (
            <ProviderRedirectStep
                provider={step}
                email={email}
                onBack={() => setStep('email')}
            />
        );
    }

    return (
        <EmailStep
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleEmailSubmit}
            pending={pending}
            error={error}
        />
    );
}
