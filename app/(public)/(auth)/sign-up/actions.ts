'use server';

import { getInjection } from '@/di/container';
import { EmailTakenError } from '@/src/entities/errors/auth';
import { BackendValidationError, InputParseError } from '@/src/entities/errors/common';
import type { SignUpMethod } from '@/src/entities/models/sign-up-method';

export type ResolveSignUpMethodResult =
    | { method: SignUpMethod }
    | { error: string };

export async function resolveSignUpMethod(
    email: string,
): Promise<ResolveSignUpMethodResult> {
    try {
        const controller = getInjection('IResolveSignUpMethodController');
        const { method } = await controller({ email });
        return { method };
    } catch (error) {
        if (error instanceof InputParseError) {
            return { error: 'Ingresá un email válido.' };
        }
        getInjection('ICrashReporterService').report(error);
        return { error: 'Algo salió mal. Probá de nuevo.' };
    }
}

export type ResendVerificationState = { error?: string };

export async function resendVerification(email: string): Promise<ResendVerificationState> {
    try {
        const controller = getInjection('IResendVerificationController');
        await controller({ email });
    } catch (error) {
        if (error instanceof InputParseError) return { error: 'Ingresá un email válido.' };
        getInjection('ICrashReporterService').report(error);
        return { error: 'Algo salió mal. Probá de nuevo.' };
    }
    return {};
}

export type SignUpState = {
    error?: string;
    sent?: boolean;
    // The email an EmailTakenError was raised for, so the "reenviar" button knows who to resend to.
    emailTaken?: string;
};

export async function signUp(
    _prevState: SignUpState,
    formData: FormData,
): Promise<SignUpState> {
    const email = formData.get('email')?.toString();
    try {
        const controller = getInjection('ISignUpController');
        await controller({
            email,
            name: formData.get('name')?.toString(),
            password: formData.get('password')?.toString(),
        });
    } catch (error) {
        if (error instanceof BackendValidationError) {
            // The back rejected what the front's rules let through: they've drifted, so report it too.
            getInjection('ICrashReporterService').report(error);
        }
        if (error instanceof InputParseError || error instanceof BackendValidationError) {
            return { error: 'Revisá los datos: un email válido, tu nombre y una contraseña de 12 a 72 caracteres.' };
        }
        if (error instanceof EmailTakenError) {
            return {
                error: 'Ya existe una cuenta con ese email. Iniciá sesión, o si no te llegó el mail, reenviá la verificación.',
                emailTaken: email,
            };
        }
        getInjection('ICrashReporterService').report(error);
        return { error: 'Algo salió mal. Probá de nuevo.' };
    }
    return { sent: true };
}
