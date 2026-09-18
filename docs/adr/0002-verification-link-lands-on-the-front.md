---
status: superseded
---

> **Superseded**: la verificación pasa a un código de 6 caracteres que el Usuario tipea a mano, no un link.
> Ya no hay link que aterrizar en el front ni Route Handler que escriba la cookie de Sesión: la escribe la
> server action `verifyEmail` en `app/(public)/(auth)/sign-up/actions.ts`. De paso, el endpoint correcto
> siempre fue `POST /users/verification` (no `/users/verification/resend`, como decía este documento).

# El Link de verificación apunta al front, no al back

El link que llega por email abre `/verify-email?token=…` en el front, un Route Handler que canjea el token contra `POST /users/verification/resend` y escribe la cookie de Sesión.

La alternativa era apuntar el link al back y que él redirigiera al front ya autenticado. La descartamos porque la cookie de Sesión es `httpOnly` y la escribe el front en su propio dominio: para que el back la escriba habría que darle autoridad sobre el dominio del front, y la única salida sin eso es pasar la Sesión por querystring en el redirect, donde queda en el historial del navegador, en el `Referer` y en los logs de cualquier proxy intermedio.

Es un Route Handler y no un `page.tsx` porque Next no permite setear cookies durante el render de un Server Component, y `route.ts` y `page.tsx` no pueden convivir en el mismo segmento.

El token viaja en el link y nada más: no se ata a la sesión del navegador donde se hizo el registro, porque el caso más común es registrarse en la computadora y abrir el mail en el celular.

## Consequences

- El front define dos errores de dominio, `VerificationLinkExpiredError` (410) y `VerificationLinkInvalidError` (400, que cubre inválido, ya usado y manipulado). Si el back cambia los códigos, se toca solo el mapa de errores de `AuthenticationService`.
- Vencido e inválido redirigen a `/sign-up?verification=expired|invalid`; cualquier otra falla se reporta y redirige al sign-up pelado, porque no hay nada que contarle al Usuario. La pantalla que lee ese motivo llega en un ticket posterior; hasta entonces el sign-up se muestra como siempre.
- `proxy.ts` no cambia: `/verify-email` no es ruta protegida ni de auth, así que pasa derecho por el chequeo optimista de cookie. Pero si el Usuario que abre el link ya tiene cookie de Sesión, `/sign-up?verification=…` sí es una ruta de auth y `proxy.ts` la rebota a `/` antes de que se lea el motivo — para ese caso el Route Handler redirige directo a `/?verification=…`, que `proxy.ts` no gatea nunca.
