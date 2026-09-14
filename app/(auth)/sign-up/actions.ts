'use server';

import { getInjection } from '@/di/container';
import { InputParseError } from '@/src/entities/errors/common';
import type { SignUpMethod } from '@/src/entities/models/sign-up-method';

export type ResolveSignUpMethodResult = {
    method?: SignUpMethod;
    error?: string;
};

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
    _formData: FormData,
): Promise<SignUpState> {
    // TODO: once the sign-up feature exists, replace this stub with:
    //   const controller = getInjection('ISignUpController');
    //   try {
    //       const { data } = await controller({ email, name, password });
    //       set the session cookie, then redirect('/dashboard');
    //   } catch (error) {
    //       branch on `instanceof` for each entities error → return { error: message };
    //       report anything unrecognized through ICrashReporterService.
    return { error: 'La creación de cuenta todavía no está disponible.' };
}
