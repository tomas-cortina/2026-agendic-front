'use server';

import { redirect } from 'next/navigation';
import { getInjection } from '@/di/container';
import { EmailTakenError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import type { SignUpMethod } from '@/src/entities/models/sign-up-method';
import { setSessionCookie } from '../session-cookie';

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

export type SignUpState = {
    error?: string;
};

export async function signUp(
    _prevState: SignUpState,
    formData: FormData,
): Promise<SignUpState> {
    try {
        const controller = getInjection('ISignUpController');
        const session = await controller({
            email: formData.get('email')?.toString(),
            name: formData.get('name')?.toString(),
            password: formData.get('password')?.toString(),
        });
        await setSessionCookie(session);
    } catch (error) {
        if (error instanceof InputParseError) {
            return { error: 'Revisá los datos: un email válido, tu nombre y una contraseña de 12 a 72 caracteres.' };
        }
        if (error instanceof EmailTakenError) {
            return { error: 'Ya existe una cuenta con ese email. Iniciá sesión.' };
        }
        getInjection('ICrashReporterService').report(error);
        return { error: 'Algo salió mal. Probá de nuevo.' };
    }
    redirect('/');
}
