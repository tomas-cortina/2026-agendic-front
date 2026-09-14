# In-memory auth with hand-rolled sessions

Sign-up and sign-in follow nikolovlazar/nextjs-clean-architecture, with three deliberate deviations. There is no database yet, so Usuarios live in `MockUsersRepository` in every environment and sessions in a `Map` inside `AuthenticationService`; everything is lost on server restart. Lucia is not used (its author deprecated it in favour of hand-rolled sessions): a session is a random id in an httpOnly cookie that `app/` sets. Users are identified by email, not username, to fit the existing sign-up wizard. Passwords are hashed with bcrypt-ts. Google/Microsoft sign-in is out of scope.

The sign-up wizard's email step still runs `resolveSignUpMethodUseCase`, but its domain→Proveedor de identidad mapping is emptied, so every email currently resolves to `'password'`. The Proveedor de identidad UI (`ProviderButton`, `ProviderRedirectStep`) stays in the tree, unused, as a head start for the OAuth ticket, rather than being deleted and rebuilt.

This feature includes sign-out and a minimal "is this session still valid" check, used by the root layout to show the signed-in Usuario's name and a sign-out control in the `Header`. It does not include full route protection: no page requires a session yet, and there's no `proxy.ts` guard. That's why `IAuthenticationService` gets `validateSession` now (throwing `UnauthenticatedError` for a missing, unknown or expired session), while enforcing it on protected routes is a separate, later ticket. A stale cookie left behind by a server restart is not cleared: the Header just renders signed-out until the next sign-in overwrites it.

## Consequences

- When a database lands: write a real `UsersRepository` plus a sessions table, and bind `MockUsersRepository` only under `NODE_ENV === 'test'`.
- Route protection (redirecting unauthenticated visitors away from pages that require a Usuario) is not implemented; add it, along with `proxy.ts`, when the first such page exists.
- When OAuth ships, restore the domain→Proveedor de identidad mapping in `resolveSignUpMethodUseCase`; the routing UI it feeds is already in place.
