import { Button } from '@/app/_components/ui/button';
import { cn } from '@/app/_components/utils';
import type { Provider } from '@/src/entities/models/provider';
import { PROVIDER_LABEL } from './providers';

export function ProviderButton({
    provider,
    className,
}: {
    provider: Provider;
    className?: string;
}) {
    return (
        <Button
            type="button"
            variant="outline"
            className={cn(
                'text-[14px] font-semibold text-foreground bg-white border-[1.5px] border-[#d6dbe6] px-4.5 py-[11px] rounded-[10px] hover:bg-gray-50 transition-colors h-auto',
                className,
            )}
        >
            Continuar con {PROVIDER_LABEL[provider]}
        </Button>
    );
}
