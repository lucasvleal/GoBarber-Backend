import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface Request {
    user_id: string;
}

@injectable()
export default class ListProviderService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,
    ) {}

    public async execute({ user_id }: Request): Promise<User[]> {
        const users = await this.userRepository.findAllProviders({
            exceptUserId: user_id,
        });

        return users;
    }
}
