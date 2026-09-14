# 01: Stop routing sign-up emails to OAuth providers

**What to build:** Any visitor who types an email at the sign-up wizard's first step — including gmail.com, googlemail.com, outlook.com, hotmail.com, or live.com addresses — lands on the password step, not the dormant Proveedor de identidad redirect step. Google/Microsoft sign-up stays out of scope for now; the routing UI (`ProviderButton`, `ProviderRedirectStep`) is left in place unused so the future OAuth ticket has a head start.

**Blocked by:** None (can start immediately)

**Status:** done (8e35c57)

- [x] `resolveSignUpMethodUseCase`'s `PROVIDER_BY_DOMAIN` map is emptied (not deleted) so it always falls through to `'password'`
- [x] Every email, including the domains that used to map to `'google'`/`'microsoft'`, resolves to `'password'`
- [x] `resolve-sign-up-method.use-case.test.ts` and `resolve-sign-up-method.controller.test.ts` are updated to reflect the new always-`'password'` behavior
- [x] `npm test` and `npm run lint` pass
