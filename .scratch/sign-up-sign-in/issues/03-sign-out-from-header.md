# 03: Cerrar sesión from the Header

**What to build:** Next to the Usuario's name in the `Header`, a "Cerrar sesión" button. Clicking it ends the Sesión server-side, deletes the `session` cookie, and redirects to `/`, where the Header shows the signed-out state. If the Sesión was already invalid (expired, or lost on a server restart), the cookie is still deleted and the redirect still happens: to the Usuario the outcome is the same. See `docs/specs/sign-up-sign-in.md` and ADR 0001.

**Blocked by:** 02

**Status:** done (a4a6418)

- [x] `IAuthenticationService` gains `invalidateSession(sessionId): Promise<void>`, implemented in `AuthenticationService` and `MockAuthenticationService`
- [x] New `src/application/use-cases/auth/sign-out.use-case.ts`: `signOutUseCase(instrumentationService, authenticationService)(sessionId)` calls `invalidateSession`
- [x] New `src/interface-adapters/controllers/auth/sign-out.controller.ts`: no `sessionId` → `UnauthenticatedError`; otherwise `validateSession` (throws `UnauthenticatedError`), then the use case. No presenter: there is nothing to return
- [x] `ISignOutUseCase` and `ISignOutController` registered in `di/types.ts` and `di/modules/auth.module.ts`
- [x] `signOut` server action in `app/(auth)/actions.ts`: reads the cookie via `getSessionId()`, calls `ISignOutController`, ignores `UnauthenticatedError`, reports anything else through `ICrashReporterService`, always deletes the `session` cookie, then `redirect('/')`
- [x] `Header` renders the button as `<form action={signOut}>`: no `'use client'` needed
- [x] `tests/unit/application/use-cases/auth/sign-out.use-case.test.ts`: after sign-out, the Sesión no longer validates (`UnauthenticatedError` through `IGetCurrentUserController`)
- [x] `tests/unit/interface-adapters/controllers/auth/sign-out.controller.test.ts`: happy path, `UnauthenticatedError` for no session id and for an already-closed Sesión
- [x] Manual check in `npm run dev`: sign in, click "Cerrar sesión", the Header shows the signed-out state and stays that way after a reload
- [x] `npm test` and `npm run lint` pass
