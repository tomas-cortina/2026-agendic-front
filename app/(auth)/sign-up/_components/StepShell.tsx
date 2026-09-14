import Link from 'next/link';

export function StepShell({
    title,
    subtitle,
    centerFooter = false,
    children,
}: {
    title: string;
    subtitle?: React.ReactNode;
    centerFooter?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="p-12 pb-10 flex flex-col justify-center">
            <div className="text-[28px] font-extrabold mb-1.5 text-foreground">
                {title}
            </div>
            {subtitle && (
                <div className="text-[14px] text-muted-foreground mb-6">
                    {subtitle}
                </div>
            )}
            {children}
            <div
                className={`text-[13px] text-muted-foreground ${centerFooter ? 'text-center mt-4' : 'mt-6'}`}
            >
                ¿Ya tenés una cuenta en Agendic?{' '}
                <Link
                    href="/sign-in"
                    transitionTypes={['auth-nav']}
                    className="text-foreground font-semibold hover:text-primary transition-colors"
                >
                    Iniciar sesión →
                </Link>
            </div>
        </div>
    );
}

export function FormError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <p
            aria-live="polite"
            className="text-[13px] text-destructive -mt-2.5 mb-4.5"
        >
            {message}
        </p>
    );
}
