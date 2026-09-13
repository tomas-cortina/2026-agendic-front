'use server';

export type SignInState = {
    error?: string;
};

export async function signIn(
    _prevState: SignInState,
    _formData: FormData,
): Promise<SignInState> {
    // TODO: once the sign-in feature exists, replace this stub with:
    //   const controller = getInjection('ISignInController');
    //   try {
    //       const { data } = await controller({ email, password }, sessionId);
    //       set the session cookie, then redirect('/dashboard');
    //   } catch (error) {
    //       branch on `instanceof` for each entities error → return { error: message };
    //       report anything unrecognized through ICrashReporterService.
    return { error: 'El inicio de sesión todavía no está disponible.' };
}
