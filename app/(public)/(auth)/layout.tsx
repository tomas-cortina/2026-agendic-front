import { redirect } from 'next/navigation';
import { ViewTransition } from 'react';
import { getCurrentUser } from './current-user';

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (user) redirect('/turnos');

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
                    {children}
                </ViewTransition>
            </div>
        </main>
    );
}
