'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { signUp, type SignUpState } from '../actions';

const initialState: SignUpState = {};

export function SignupForm() {
    const [state, formAction, pending] = useActionState(
        signUp,
        initialState,
    );

    return (
        <div className="p-12 pb-10 flex flex-col justify-center">
            <div className="text-[28px] font-extrabold mb-1.5 text-foreground">
                Creá tu cuenta gratis
            </div>
            <div className="text-[14px] text-muted-foreground mb-6">
                No necesitás tarjeta. Ampliás cuando quieras.
            </div>

            <form action={formAction} className="flex flex-col">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="vos@tunegocio.com"
                    aria-label="Email"
                    className="h-auto px-3.5 py-3 rounded-lg mb-3.5"
                />

                <Button
                    type="submit"
                    disabled={pending}
                    className="text-[14px] font-bold text-white bg-foreground px-4.5 py-3 rounded-[10px] hover:bg-foreground/90 transition-colors h-auto mb-4.5"
                >
                    {pending ? 'Enviando…' : 'Continuar con email'}
                </Button>

                {state.error && (
                    <p
                        aria-live="polite"
                        className="text-[13px] text-destructive -mt-2.5 mb-4.5"
                    >
                        {state.error}
                    </p>
                )}

                <div className="flex items-center gap-2.5 text-muted-foreground text-[12px] mb-4.5">
                    <div className="flex-1 h-px bg-border" />
                    o
                    <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex flex-col gap-2.5 mb-4.5">
                    <Button
                        type="button"
                        variant="outline"
                        className="text-[14px] font-semibold text-foreground bg-white border-[1.5px] border-[#d6dbe6] px-4.5 py-[11px] rounded-[10px] hover:bg-gray-50 transition-colors h-auto"
                    >
                        Continuar con Google
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="text-[14px] font-semibold text-foreground bg-white border-[1.5px] border-[#d6dbe6] px-4.5 py-[11px] rounded-[10px] hover:bg-gray-50 transition-colors h-auto"
                    >
                        Continuar con Microsoft
                    </Button>
                </div>

                <div className="text-[12.5px] text-muted-foreground leading-[1.45]">
                    Al continuar con Google o Microsoft, sincronizás tu agenda
                    automáticamente.
                </div>
            </form>

            <div className="text-[13px] text-muted-foreground mt-6">
                ¿Ya tenés una cuenta en Agendic?{' '}
                <Link href="/sign-in" transitionTypes={['auth-nav']} className="text-foreground font-semibold hover:text-primary transition-colors">
                    Iniciar sesión →
                </Link>
            </div>
        </div>
    );
}
