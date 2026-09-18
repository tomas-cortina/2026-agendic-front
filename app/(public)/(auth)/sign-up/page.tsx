import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { ViewTransition } from 'react';
import { SignupBrandPanel } from './_components/SignupBrandPanel';

export const metadata: Metadata = {
    title: 'Crear cuenta — Agendic',
};

export default function SignUpPage() {
    return (
        <ViewTransition enter="auth-in" exit="auth-out" default="none">
            <div className="flex-1 grid md:grid-cols-2 w-[920px] max-w-full">
                <SignupBrandPanel />
                <div className="flex items-center justify-center p-12">
                    <SignUp appearance={{ elements: { rootBox: 'w-full', cardBox: 'w-full shadow-none' } }} />
                </div>
            </div>
        </ViewTransition>
    );
}
