'use client';

import { useState, useTransition } from 'react';
import type { SignUpMethod } from '@/src/entities/models/sign-up-method';
import { resolveSignUpMethod } from '../actions';
import { DetailsStep } from './DetailsStep';
import { EmailStep } from './EmailStep';
import { ProviderRedirectStep } from './ProviderRedirectStep';

// EmailStep and ProviderRedirectStep are client components because this file imports them;
// they take function props, so they must not become 'use client' entry points themselves.
export function SignupForm() {
    const [step, setStep] = useState<'email' | SignUpMethod>('email');
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

    if (step === 'password') return <DetailsStep email={email} />;

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
