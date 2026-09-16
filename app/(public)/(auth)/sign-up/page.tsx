import type { Metadata } from 'next';
import { ViewTransition } from 'react';
import { SignupBrandPanel } from './_components/SignupBrandPanel';
import { SignupForm } from './_components/SignupForm';
import type { VerificationReason } from './_components/VerificationErrorStep';

export const metadata: Metadata = {
    title: 'Crear cuenta — Agendic',
};

export default async function SignUpPage({
    searchParams,
}: {
    searchParams: Promise<{ verification?: string }>;
}) {
    const { verification } = await searchParams;
    const knownReasons: VerificationReason[] = ['expired', 'invalid'];
    const verificationReason = knownReasons.find((reason) => reason === verification);

    return (
        <ViewTransition enter="auth-in" exit="auth-out" default="none">
            <div className="flex-1 grid md:grid-cols-2 w-[920px] max-w-full">
                <SignupBrandPanel />
                <SignupForm verificationReason={verificationReason} />
            </div>
        </ViewTransition>
    );
}
