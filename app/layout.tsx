import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Header } from '@/app/_components/Header';
import { Footer } from '@/app/_components/Footer';
import { getCurrentUser } from './(auth)/current-user';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Agendic — Turnos online para tu negocio',
    description:
        'Organizá tu agenda, reducí las ausencias y dejá de atender turnos por WhatsApp. Agenda online para clínicas, spas, gimnasios y academias.',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
    const user = await getCurrentUser();

    return (
        <html
            lang="es"
            className={`${plusJakartaSans.className} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-white text-foreground">
                <Header user={user} />
                <div className="flex-1 flex flex-col">{children}</div>
                <Footer />
            </body>
        </html>
    );
}
