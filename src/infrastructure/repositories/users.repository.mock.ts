import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { CreateUser, User } from '@/src/entities/models/user';

export class MockUsersRepository implements IUsersRepository {
    private readonly users = new Map<string, User>();

    async getUserByEmail(email: string): Promise<User | undefined> {
        return this.users.get(email);
    }

    async createUser(input: CreateUser): Promise<User> {
        const user = { id: crypto.randomUUID(), ...input };
        this.users.set(user.email, user);
        return user;
    }
}
