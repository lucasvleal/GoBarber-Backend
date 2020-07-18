import path from 'path';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
    user_id: string;
    avatarFilename: string;
}

@injectable()
export default class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,
    ) {}

    public async execute({ user_id, avatarFilename }: Request): Promise<User> {
        const user = await this.userRepository.findById(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar',
                401,
            );
        }

        if (user.avatar) {
            // Deletar avatar antigo se ja tem
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );

            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        await this.userRepository.save(user);

        return user;
    }
}
