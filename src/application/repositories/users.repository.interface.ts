import type { CreateUser, User } from '@/src/entities/models/user';

export interface IUsersRepository {
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(input: CreateUser): Promise<User>;
}
