'use server';

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
