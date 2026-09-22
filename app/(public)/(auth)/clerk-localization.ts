import { esES } from '@clerk/localizations';

export const clerkLocalization: typeof esES = {
    ...esES,
    signIn: {
        ...esES.signIn,
        start: {
            ...esES.signIn?.start,
            title: 'Iniciar sesión',
            subtitle: 'Entrá al panel de tu negocio.',
            actionText: '¿No tenés cuenta?',
            actionLink: 'Empezá gratis',
        },
    },
    signUp: {
        ...esES.signUp,
        start: {
            ...esES.signUp?.start,
            title: 'Creá tu cuenta gratis',
            subtitle: 'No necesitás tarjeta. Ampliás cuando quieras.',
            actionText: '¿Ya tenés una cuenta en Agendic?',
            actionLink: 'Iniciar sesión',
        },
    },
    formFieldInputPlaceholder__emailAddress: 'vos@tunegocio.com',
    dividerText: 'o',
};
