import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { ViewTransition } from 'react';
import { clerkAppearance } from '../../clerk-appearance';

export const metadata: Metadata = {
    title: 'Crear cuenta — Agendic',
};

export default function SignUpPage() {
    return (
        <ViewTransition enter="auth-in" exit="auth-out" default="none">
            <div className="flex-1 flex items-center justify-center w-[640px] max-w-full p-12">
                <SignUp appearance={clerkAppearance} />
            </div>
        </ViewTransition>
    );
}
