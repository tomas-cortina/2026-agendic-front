'use server';

import { redirect } from 'next/navigation';
import { getInjection } from '@/di/container';
import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { setSessionCookie } from '../session-cookie';

export type SignInState = {
    error?: string;
};

export async function signIn(
    _prevState: SignInState,
    formData: FormData,
): Promise<SignInState> {
    try {
        const controller = getInjection('ISignInController');
        const session = await controller({
            email: formData.get('email')?.toString(),
            password: formData.get('password')?.toString(),
        });
        await setSessionCookie(session);
    } catch (error) {
        if (error instanceof InputParseError || error instanceof AuthenticationError) {
            return { error: 'Email o contraseña incorrectos.' };
        }
        getInjection('ICrashReporterService').report(error);
        return { error: 'Algo salió mal. Probá de nuevo.' };
    }
    redirect('/');
}
