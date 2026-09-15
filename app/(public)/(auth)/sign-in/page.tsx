import type { Metadata } from 'next';
import { ViewTransition } from 'react';
import { SigninForm } from './_components/SigninForm';

export const metadata: Metadata = {
    title: 'Iniciar sesión — Agendic',
};

export default function SignInPage() {
    return (
        <ViewTransition enter="auth-in" exit="auth-out" default="none">
            <div className="flex-1 flex w-[520px] max-w-full">
                <SigninForm />
            </div>
        </ViewTransition>
    );
}
