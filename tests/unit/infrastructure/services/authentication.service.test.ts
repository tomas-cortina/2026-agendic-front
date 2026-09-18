import { currentUser } from '@clerk/nextjs/server';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { AuthenticationService } from '@/src/infrastructure/services/authentication.service';

jest.mock('@clerk/nextjs/server', () => ({ currentUser: jest.fn() }));

const mockedCurrentUser = jest.mocked(currentUser);
const authenticationService = new AuthenticationService();

afterEach(() => jest.resetAllMocks());

const clerkUser = (overrides: Partial<{ firstName: string | null; lastName: string | null }> = {}) => ({
    id: 'user_123',
    primaryEmailAddressId: 'email_1',
    emailAddresses: [{ id: 'email_1', emailAddress: 'ana@negocio.com' }],
    firstName: 'Ana',
    lastName: 'Pérez',
    ...overrides,
});

describe('AuthenticationService', () => {
    describe('getCurrentUser', () => {
        it('returns the Usuario behind the Sesión', async () => {
            mockedCurrentUser.mockResolvedValue(clerkUser() as never);

            await expect(authenticationService.getCurrentUser()).resolves.toEqual({
                id: 'user_123',
                email: 'ana@negocio.com',
                name: 'Ana Pérez',
            });
        });

        it('throws UnauthenticatedError when there is no Sesión', async () => {
            mockedCurrentUser.mockResolvedValue(null);

            await expect(authenticationService.getCurrentUser()).rejects.toBeInstanceOf(UnauthenticatedError);
        });

        it('falls back to the email when the Usuario has no name', async () => {
            mockedCurrentUser.mockResolvedValue(clerkUser({ firstName: null, lastName: null }) as never);

            await expect(authenticationService.getCurrentUser()).resolves.toMatchObject({
                name: 'ana@negocio.com',
            });
        });
    });
});
