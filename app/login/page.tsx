import type { Metadata } from 'next';
import { Header } from '@/app/_components/Header';
import { Card } from '@/app/_components/ui/card';
import { LoginBrandPanel } from './_components/LoginBrandPanel';
import { LoginForm } from './_components/LoginForm';
import { Footer } from './_components/Footer';

export const metadata: Metadata = {
    title: 'Iniciar sesión — Agendic',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-foreground">
            <Header />
            <main className="flex-1 flex items-center justify-center px-6 py-10">
                <div
                    className="w-[90%] min-h-[80vh] max-w-none rounded-[28px] p-16 box-border flex items-center justify-center"
                    style={{
                        background:
                            'linear-gradient(160deg,#cfe4f7 0%,#d9edf0 32%,#e3f2e2 62%,#eef6da 100%)',
                    }}
                >
                    <Card className="w-full max-w-[920px] p-0 gap-0 ring-0 rounded-2xl shadow-[0_30px_70px_rgba(15,27,45,0.18)] overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            <LoginBrandPanel />
                            <LoginForm />
                        </div>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
