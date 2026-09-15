'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { TurnosView } from './TurnosView';
import { DisponibilidadView } from './DisponibilidadView';
import { PlaceholderView } from './PlaceholderView';
import type { CurrentBusinessUser, NavItem, Schedule, ScheduleDetail, SectionId, TurnosByTab } from './types';

const TITLES: Record<SectionId, { title: string; subtitle?: string }> = {
    turnos: { title: 'Turnos', subtitle: 'Gestioná la agenda de todas tus sucursales en tiempo real.' },
    disponibilidad: { title: 'Disponibilidad', subtitle: 'Definí los horarios en los que tus clientes pueden reservar.' },
    servicios: { title: 'Servicios' },
    staff: { title: 'Profesionales' },
    sucursales: { title: 'Sucursales' },
    clientes: { title: 'Clientes' },
    metricas: { title: 'Métricas' },
    config: { title: 'Configuración' },
};

export function DashboardShell({
    user,
    navItems,
    turnosByTab,
    pendingCount,
    schedules,
    scheduleDetail,
}: {
    user: CurrentBusinessUser;
    navItems: NavItem[];
    turnosByTab: TurnosByTab;
    pendingCount: number;
    schedules: Schedule[];
    scheduleDetail: ScheduleDetail;
}) {
    const [section, setSection] = useState<SectionId>('turnos');
    const { title, subtitle } = TITLES[section];

    return (
        <div className="flex min-h-screen w-full bg-muted">
            <Sidebar user={user} navItems={navItems} activeSection={section} onSelectSection={setSection} />

            <main className="flex min-w-0 flex-1 flex-col">
                <Topbar title={title} subtitle={subtitle} />

                {section === 'turnos' ? (
                    <TurnosView turnosByTab={turnosByTab} pendingCount={pendingCount} />
                ) : section === 'disponibilidad' ? (
                    <DisponibilidadView schedules={schedules} detail={scheduleDetail} />
                ) : (
                    <PlaceholderView title={title} onBack={() => setSection('turnos')} />
                )}
            </main>
        </div>
    );
}
