# 04: Route protection

**What to build:** Pages that require a Usuario redirect visitors without a valid Sesión away from them, through a `proxy.ts` guard. Signed-in Usuarios reaching `/sign-in` or `/sign-up` are redirected to `/`. Along the way, pay back the architecture debt left by 02: `getCurrentUserController` authenticates and returns the Usuario with no use case, breaking the controller→use-case rule in `docs/agents/clean-architecture.md`. See `docs/specs/sign-up-sign-in.md` (Out of scope) and ADR 0001 (Consequences).

**Blocked by:** the first page that requires a Sesión (none exists yet)

**Status:** done (c58dccb) — `proxy.ts`'s `protectedRoutes` list ships empty, since no page requires a Sesión yet; add routes there when the first one does

- [x] `proxy.ts` guard redirects visitors without a valid Sesión away from pages that require a Usuario (scaffolded; `protectedRoutes` is empty until such a page exists)
- [x] Signed-in Usuarios reaching `/sign-in` or `/sign-up` are redirected to `/`
- [x] New `src/application/use-cases/auth/get-current-user.use-case.ts`: `getCurrentUserUseCase(instrumentationService, usersRepository)(userId)` returns the User
- [x] `getCurrentUserController` authenticates with `validateSession` and passes `session.userId` to the use case; `IGetCurrentUserUseCase` registered in `di/types.ts` and `di/modules/auth.module.ts`
- [x] The `ponytail:` comment in `get-current-user.controller.ts` and its bullet in ADR 0001 Consequences are removed
- [x] `tests/unit/application/use-cases/auth/get-current-user.use-case.test.ts`: happy path plus every not-found branch
- [x] `npm test` and `npm run lint` pass
