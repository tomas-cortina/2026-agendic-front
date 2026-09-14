import Link from 'next/link';

export function StepShell({
    children,
    centerFooter = false,
}: {
    children: React.ReactNode;
    centerFooter?: boolean;
}) {
    return (
        <div className="p-12 pb-10 flex flex-col justify-center">
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
