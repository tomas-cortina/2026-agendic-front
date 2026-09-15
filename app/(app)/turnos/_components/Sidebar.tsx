import {
    Calendar,
    Clock,
    LayoutGrid,
    Users,
    Building2,
    UserRound,
    BarChart3,
    Settings,
    ExternalLink,
    Link as LinkIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarBadge } from '@/app/_components/ui/avatar';
import { Badge } from '@/app/_components/ui/badge';
import { cn } from '@/app/_components/utils';
import type { CurrentBusinessUser, NavItem, SectionId } from './types';

const ICONS: Record<SectionId, React.ComponentType<{ className?: string }>> = {
    turnos: Calendar,
    disponibilidad: Clock,
    servicios: LayoutGrid,
    staff: Users,
    sucursales: Building2,
    clientes: UserRound,
    metricas: BarChart3,
    config: Settings,
};

const ITEM = 'flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left font-semibold transition-colors hover:bg-muted';

export function Sidebar({
    user,
    navItems,
    activeSection,
    onSelectSection,
}: {
    user: CurrentBusinessUser;
    navItems: NavItem[];
    activeSection: SectionId;
    onSelectSection: (section: SectionId) => void;
}) {
    const tone = (id: SectionId) => (id === activeSection ? 'bg-secondary text-primary' : 'text-muted-foreground');

    return (
        <aside className="flex w-[248px] shrink-0 flex-col gap-5 border-r border-border bg-white p-3.5 pt-4.5">
            <div className="flex items-center gap-2.5 px-1">
                <Avatar>
                    <AvatarFallback className="bg-secondary text-[12px] font-extrabold text-primary">
                        {user.initials}
                    </AvatarFallback>
                    <AvatarBadge className="bg-[#16a34a] ring-white" aria-label="Conectado" />
                </Avatar>
                <div className="flex min-w-0 flex-col leading-[1.15]">
                    <span className="truncate text-[14px] font-extrabold tracking-[-0.025em]">{user.name}</span>
                    <span className="text-[11px] font-semibold text-muted-foreground">{user.role}</span>
                </div>
            </div>

            <nav className="flex flex-col gap-0.5">
                {navItems.map((item) => {
                    const Icon = ICONS[item.id];
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelectSection(item.id)}
                            aria-current={item.id === activeSection ? 'page' : undefined}
                            className={cn(ITEM, 'text-[13.5px] tracking-[-0.01em]', tone(item.id))}
                        >
                            <Icon className="size-[18px]" />
                            {item.label}
                            {item.count ? (
                                <Badge className="ml-auto rounded-full border-transparent bg-secondary px-2 py-0.5 text-[11px] font-bold text-primary">
                                    {item.count}
                                </Badge>
                            ) : null}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto flex flex-col gap-0.5">
                <button type="button" className={cn(ITEM, 'text-[13px] text-muted-foreground hover:text-foreground')}>
                    <ExternalLink className="size-[17px]" />
                    Ver página pública
                </button>
                <button type="button" className={cn(ITEM, 'text-[13px] text-muted-foreground hover:text-foreground')}>
                    <LinkIcon className="size-[17px]" />
                    Copiar link para reservar
                </button>
                <button
                    type="button"
                    onClick={() => onSelectSection('config')}
                    aria-current={activeSection === 'config' ? 'page' : undefined}
                    className={cn(ITEM, 'text-[13px]', tone('config'))}
                >
                    <Settings className="size-[17px]" />
                    Configuración
                </button>
            </div>

            <div className="flex items-center gap-2 border-t border-border px-2 pt-3">
                <div className="flex size-6 items-center justify-center rounded-md bg-primary text-[12px] font-extrabold tracking-[-0.03em] text-white">
                    a
                </div>
                <div className="flex flex-col leading-[1.2]">
                    <span className="text-[12.5px] font-extrabold tracking-[-0.02em]">
                        agendic<span className="text-primary">.</span>
                    </span>
                    <span className="text-[10.5px] font-medium text-muted-foreground">v1.0</span>
                </div>
            </div>
        </aside>
    );
}
