# 02: Show the signed-in Usuario in the Header

**What to build:** A Usuario with a valid Sesión sees their name in the `Header` on every page, in place of "Ir a mi cuenta" / "Empezá gratis". A visitor with no `session` cookie, an unknown session id, or an expired Sesión sees the Header exactly as today. This is a minimal validity check only: no route protection, no `proxy.ts` guard, no redirects. See `docs/specs/sign-up-sign-in.md` and ADR 0001.

**Blocked by:** None (can start immediately)

**Status:** done (d46627a); its `getCurrentUserController`/no-use-case shortcut was later paid back by ticket 04 (c58dccb)

- [x] `UnauthenticatedError` added to `src/entities/errors/auth.ts`
- [x] `IUsersRepository` gains `getUser(id): Promise<User | undefined>`, implemented in `MockUsersRepository`
- [x] `IAuthenticationService` gains `validateSession(sessionId): Promise<{ user: User; session: Session }>`, throwing `UnauthenticatedError` for an unknown or expired Sesión or one whose Usuario no longer exists
- [x] `AuthenticationService` takes `IUsersRepository` through its constructor (DI binding lists it) and implements `validateSession`; `MockAuthenticationService` does the same, and now stores the sessions it creates
- [x] New `src/interface-adapters/controllers/auth/get-current-user.controller.ts`: no `sessionId` → `UnauthenticatedError`; otherwise `validateSession`; presenter whitelists `{ name }`. No use case: authentication is the whole operation
- [x] `IGetCurrentUserController` registered in `di/types.ts` and `di/modules/auth.module.ts`
- [x] `getSessionId()` added next to `setSessionCookie` in `app/(auth)/session-cookie.ts`, so the cookie name lives in one place
- [x] `app/layout.tsx` calls `IGetCurrentUserController` with the cookie value: `UnauthenticatedError` → signed-out; any other error → `ICrashReporterService.report`, render signed-out. It passes `user: { name } | null` to `Header` as a prop (the Header never fetches, per `ui-components.md`)
- [x] `Header` stays a server component; with a `user`, it shows the name instead of the two auth buttons
- [x] `tests/unit/interface-adapters/controllers/auth/get-current-user.controller.test.ts`: happy path (Sesión created via sign-up returns that name), `UnauthenticatedError` for no session id, an unknown session id, and an expired Sesión (jest fake timers past the TTL)
- [x] Manual check in `npm run dev`: sign up, land on `/`, the Header shows the name. If it doesn't, the server action and the layout got separate container instances; keep the in-memory `Map`s on `globalThis`
- [x] `npm test` and `npm run lint` pass
