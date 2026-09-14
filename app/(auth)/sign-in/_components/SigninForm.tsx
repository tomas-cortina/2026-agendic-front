'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { signIn, type SignInState } from '../actions';

const initialState: SignInState = {};

export function SigninForm() {
    const [state, formAction, pending] = useActionState(signIn, initialState);

    return (
        <div className="p-12 pb-10 flex flex-col justify-center w-full">
            <Link
                href="/"
                className="text-[12px] text-muted-foreground mb-5 hover:text-primary transition-colors"
            >
                ← Volver al sitio
            </Link>
            <div className="text-[25px] font-extrabold mb-1.5 text-foreground">
                Iniciar sesión
            </div>
            <div className="text-[14px] text-muted-foreground mb-6">
                Entrá al panel de tu negocio.
            </div>

            <form action={formAction} className="flex flex-col">
                <Label
                    htmlFor="email"
                    className="text-[12.5px] font-semibold text-muted-foreground mb-1.5"
                >
                    Email
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="vos@tunegocio.com"
                    className="h-auto px-3.5 py-3 rounded-lg mb-3.5"
                />

                <div className="flex justify-between items-baseline gap-2 flex-wrap mb-1.5">
                    <Label
                        htmlFor="password"
                        className="text-[12.5px] font-semibold text-muted-foreground"
                    >
                        Contraseña
                    </Label>
                    <Link
                        href="#"
                        className="text-[12.5px] font-semibold text-foreground hover:text-primary transition-colors whitespace-nowrap"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="h-auto px-3.5 py-3 rounded-lg mb-4.5"
                />

                <Button
                    type="submit"
                    disabled={pending}
                    className="text-[14px] font-bold text-white bg-primary px-4.5 py-3 rounded-[10px] hover:bg-primary/90 transition-colors h-auto mb-4.5"
                >
                    {pending ? 'Entrando…' : 'Entrar'}
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
                    o continuá con
                    <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex gap-2.5">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 text-[14px] font-semibold text-foreground bg-white border-[1.5px] border-[#d6dbe6] px-4.5 py-[11px] rounded-[10px] hover:bg-gray-50 transition-colors h-auto"
                    >
                        Google
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 text-[14px] font-semibold text-foreground bg-white border-[1.5px] border-[#d6dbe6] px-4.5 py-[11px] rounded-[10px] hover:bg-gray-50 transition-colors h-auto"
                    >
                        Microsoft
                    </Button>
                </div>
            </form>

            <div className="text-center text-[13px] text-muted-foreground mt-6">
                ¿No tenés cuenta?{' '}
                <Link
                    href="/sign-up"
                    transitionTypes={['auth-nav']}
                    className="text-foreground font-semibold hover:text-primary transition-colors"
                >
                    Empezá gratis
                </Link>
            </div>
        </div>
    );
}
