import { ViewTransition } from 'react';
import { Card } from '@/app/_components/ui/card';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex-1 flex items-center justify-center px-6 py-10">
            <div
                className="w-[100%] min-h-[85vh] max-w-none rounded-[28px] p-16 box-border flex items-center justify-center"
                style={{
                    background:
                        'linear-gradient(160deg,#cfe4f7 0%,#d9edf0 32%,#e3f2e2 62%,#eef6da 100%)',
                }}
            >
                <ViewTransition
                    update={{ 'auth-nav': 'auth-morph', default: 'none' }}
                    default="none"
                >
                    <Card className="min-w-0 min-h-[640px]max-w-[1100px] p-0 gap-0 ring-0 rounded-2xl shadow-[0_30px_70px_rgba(15,27,45,0.18)] overflow-hidden">
                        {children}
                    </Card>
                </ViewTransition>
            </div>
        </main>
    );
}
