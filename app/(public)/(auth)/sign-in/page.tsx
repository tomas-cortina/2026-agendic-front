import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { ViewTransition } from 'react';

export const metadata: Metadata = {
    title: 'Iniciar sesión — Agendic',
};

export default function SignInPage() {
    return (
        <ViewTransition enter="auth-in" exit="auth-out" default="none">
            <div className="flex-1 flex items-center justify-center w-[520px] max-w-full p-12">
                <SignIn appearance={{ elements: { rootBox: 'w-full', cardBox: 'w-full shadow-none' } }} />
            </div>
        </ViewTransition>
    );
}
