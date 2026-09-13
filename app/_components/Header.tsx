import Link from 'next/link';
import { Button } from './ui/button';

export function Header() {
    return (
        <header className="flex items-center justify-between px-16 py-5">
            <div className="text-[22px] font-extrabold tracking-[-0.02em] text-foreground">
                agendic<span className="text-primary">.</span>
            </div>
            <nav className="flex gap-8 text-[15px] font-medium text-foreground">
                <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                >
                    Funcionalidades
                </Link>
                <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                >
                    Rubros
                </Link>
                <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                >
                    Preguntas frecuentes
                </Link>
            </nav>
            <div className="flex items-center gap-2.5">
                <Button
                    asChild
                    variant="ghost"
                    className="text-[15px] font-semibold text-foreground px-4 py-2.5 hover:text-primary transition-colors h-auto"
                >
                    <Link href="/login">Ir a mi cuenta</Link>
                </Button>
                <Button
                    asChild
                    className="text-[15px] font-bold text-white bg-primary px-[18px] py-[11px] rounded-[10px] hover:bg-primary/90 transition-colors h-auto"
                >
                    <Link href="#">Empezá gratis</Link>
                </Button>
            </div>
        </header>
    );
}
