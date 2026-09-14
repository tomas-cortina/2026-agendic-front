'use client';

import { useActionState, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { signUp, type SignUpState } from '../actions';

const initialState: SignUpState = {};

type Step = 'email' | 'google' | 'microsoft' | 'details';

const PROVIDER_BY_DOMAIN: Record<string, 'google' | 'microsoft'> = {
    'gmail.com': 'google',
    'googlemail.com': 'google',
    'outlook.com': 'microsoft',
    'hotmail.com': 'microsoft',
    'live.com': 'microsoft',
    'msn.com': 'microsoft',
};

const PROVIDER_LABEL = { google: 'Google', microsoft: 'Microsoft' } as const;

const MIN_PASSWORD_LENGTH = 12;

export function SignupForm() {
    const [state, formAction, pending] = useActionState(
        signUp,
        initialState,
    );
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const domain = email.split('@')[1]?.toLowerCase();
        setStep(domain && PROVIDER_BY_DOMAIN[domain] ? PROVIDER_BY_DOMAIN[domain] : 'details');
    }

    if (step === 'google' || step === 'microsoft') {
        const provider = PROVIDER_LABEL[step];
        return (
            <div className="p-12 pb-10 flex flex-col justify-center">
                <div className="text-[28px] font-extrabold mb-1.5 text-foreground">
                    Continuá con {provider}
                </div>
                <div className="text-[14px] text-muted-foreground mb-6">
                    {email} es una cuenta de {provider}. Registrate con{' '}
                    {provider} para sincronizar tu agenda automáticamente.
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="text-[14px] font-semibold text-foreground bg-white border-[1.5px] border-[#d6dbe6] px-4.5 py-[11px] rounded-[10px] hover:bg-gray-50 transition-colors h-auto mb-3.5"
                >
                    Continuar con {provider}
                </Button>

                <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-[13px] text-muted-foreground hover:text-primary transition-colors"
                >
                    Usar otro email
                </button>

                <div className="text-[13px] text-muted-foreground mt-6">
                    ¿Ya tenés una cuenta en Agendic?{' '}
                    <Link href="/sign-in" transitionTypes={['auth-nav']} className="text-foreground font-semibold hover:text-primary transition-colors">
                        Iniciar sesión →
                    </Link>
                </div>
            </div>
        );
    }

    if (step === 'details') {
        // ponytail: length-only strength heuristic, swap in zxcvbn if real scoring matters
        const strength = Math.min(password.length / 16, 1);
        const meetsMin = password.length >= MIN_PASSWORD_LENGTH;

        return (
            <div className="p-12 pb-10 flex flex-col justify-center">
                <div className="text-[28px] font-extrabold mb-1.5 text-foreground">
                    Creá tu cuenta en Agendic gratis
                </div>

                <form action={formAction} className="flex flex-col mt-4.5">
                    <Label htmlFor="email" className="text-[13px] font-bold text-foreground mb-2">
                        Ingresá tu email para empezar.
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vos@tunegocio.com"
                        className="h-auto px-3.5 py-3 rounded-lg mb-5"
                    />

                    <Label htmlFor="name" className="text-[13px] font-bold text-foreground mb-2">
                        Ingresá tu nombre completo.
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="Juan Pérez"
                        className="h-auto px-3.5 py-3 rounded-lg mb-5"
                    />

                    <Label htmlFor="password" className="text-[13px] font-bold text-foreground mb-2">
                        Elegí una contraseña de al menos {MIN_PASSWORD_LENGTH} caracteres.
                    </Label>
                    <div className="relative mb-2">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            minLength={MIN_PASSWORD_LENGTH}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="contraseña"
                            className="h-auto px-3.5 py-3 rounded-lg pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <div className="h-1 bg-border rounded-full mb-2.5 overflow-hidden">
                        <div
                            className={`h-full transition-all ${meetsMin ? 'bg-green-500' : 'bg-amber-500'}`}
                            style={{ width: `${strength * 100}%` }}
                        />
                    </div>
                    <div
                        className={`text-[12.5px] leading-[1.6] mb-5.5 ${meetsMin ? 'text-muted-foreground' : 'text-orange-700'}`}
                    >
                        <div>• Usá varias palabras, evitá frases comunes</div>
                        <div>• No necesitás símbolos, números ni mayúsculas</div>
                    </div>

                    {state.error && (
                        <p
                            aria-live="polite"
                            className="text-[13px] text-destructive -mt-2.5 mb-4.5"
                        >
                            {state.error}
                        </p>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={pending}
                            className="text-[14.5px] font-bold text-white bg-primary px-6.5 py-3 rounded-full hover:bg-primary/90 transition-colors h-auto"
                        >
                            {pending ? 'Creando…' : 'Continuar'}
                        </Button>
                    </div>
                </form>

                <div className="text-[12.5px] text-muted-foreground text-center leading-[1.6] mt-6 max-w-[360px] mx-auto">
                    Al crear una cuenta en Agendic, aceptás los{' '}
                    <a href="#" className="text-primary hover:underline">Términos de Agendic</a> y la{' '}
                    <a href="#" className="text-primary hover:underline">Política de privacidad</a>.
                </div>

                <div className="text-[13px] text-muted-foreground text-center mt-4">
                    ¿Ya tenés una cuenta en Agendic?{' '}
                    <Link href="/sign-in" transitionTypes={['auth-nav']} className="text-foreground font-semibold hover:text-primary transition-colors">
                        Iniciar sesión →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-12 pb-10 flex flex-col justify-center">
            <div className="text-[28px] font-extrabold mb-1.5 text-foreground">
                Creá tu cuenta gratis
            </div>
            <div className="text-[14px] text-muted-foreground mb-6">
                No necesitás tarjeta. Ampliás cuando quieras.
            </div>

            <form onSubmit={handleEmailSubmit} className="flex flex-col">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vos@tunegocio.com"
                    aria-label="Email"
                    className="h-auto px-3.5 py-3 rounded-lg mb-3.5"
                />

                <Button
                    type="submit"
                    className="text-[14px] font-bold text-white bg-foreground px-4.5 py-3 rounded-[10px] hover:bg-foreground/90 transition-colors h-auto mb-4.5"
                >
                    Continuar con email
                </Button>

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
