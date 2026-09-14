import type { Metadata } from 'next';
import { ViewTransition } from 'react';
import { SignupBrandPanel } from './_components/SignupBrandPanel';
import { SignupForm } from './_components/SignupForm';

export const metadata: Metadata = {
    title: 'Crear cuenta — Agendic',
};

export default function SignUpPage() {
    return (
        <ViewTransition enter="auth-in" exit="auth-out" default="none">
            <div className="flex-1 grid md:grid-cols-2 w-[920px] max-w-full">
                <SignupBrandPanel />
                <SignupForm />
            </div>
        </ViewTransition>
    );
}
