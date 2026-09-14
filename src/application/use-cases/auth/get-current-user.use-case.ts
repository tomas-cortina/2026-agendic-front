import { NotFoundError } from '@/src/entities/errors/common';
import type { User } from '@/src/entities/models/user';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export type IGetCurrentUserUseCase = ReturnType<typeof getCurrentUserUseCase>;
export const getCurrentUserUseCase =
    (instrumentationService: IInstrumentationService, usersRepository: IUsersRepository) =>
    (userId: string): Promise<User> =>
        instrumentationService.startSpan({ name: 'getCurrentUser Use Case', op: 'function' }, async () => {
            const user = await usersRepository.getUser(userId);
            if (!user) throw new NotFoundError('User does not exist');
            return user;
        });
