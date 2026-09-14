import type { Provider } from '@/src/entities/models/provider';

export const PROVIDER_LABEL: Record<Provider, string> = {
    google: 'Google',
    microsoft: 'Microsoft',
};

export const PROVIDERS = Object.keys(PROVIDER_LABEL) as Provider[];
