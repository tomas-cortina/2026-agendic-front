'use client';

import { useActionState, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { signUp, type SignUpState } from '../actions';
import { FormError } from './FormError';
import { StepShell } from './StepShell';

const initialState: SignUpState = {};

const MIN_PASSWORD_LENGTH = 12;

const labelClass = 'text-[13px] font-bold text-foreground mb-2';

export function DetailsStep({ email }: { email: string }) {
    const [state, formAction, pending] = useActionState(signUp, initialState);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ponytail: length-only strength heuristic, swap in zxcvbn if real scoring matters
    const strength = Math.min(password.length / 16, 1);
    const meetsMin = password.length >= MIN_PASSWORD_LENGTH;

    return (
        <StepShell title="Creá tu cuenta en Agendic gratis" centerFooter>
            <form action={formAction} className="flex flex-col mt-4.5">
                <Label htmlFor="email" className={labelClass}>
                    Ingresá tu email para empezar.
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    defaultValue={email}
                    placeholder="vos@tunegocio.com"
                    className="h-auto px-3.5 py-3 rounded-lg mb-5"
                />

                <Label htmlFor="name" className={labelClass}>
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

                <Label htmlFor="password" className={labelClass}>
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
                        maxLength={72}
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

                <FormError message={state.error} />

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
        </StepShell>
    );
}
