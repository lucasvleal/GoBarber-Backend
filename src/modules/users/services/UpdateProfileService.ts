import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
    user_id: string;
    name: string;
    email: string;
    password?: string;
    oldPassword?: string;
}

@injectable()
export default class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        name,
        email,
        user_id,
        password,
        oldPassword,
    }: Request): Promise<User> {
        const user = await this.userRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        const userWithUpdatedEmail = await this.userRepository.findByEmail(
            email,
        );

        if (userWithUpdatedEmail && email !== user.email) {
            throw new AppError('Email already in use.');
        }

        user.name = name;
        user.email = email;

        if (password && !oldPassword) {
            throw new AppError('You must have to inform your old password');
        }

        if (password && oldPassword) {
            const checkOldPassword = await this.hashProvider.compareHash(
                oldPassword,
                user.password,
            );

            if (!checkOldPassword) {
                throw new AppError(
                    'Your informed old password does not match with your actual old password.',
                );
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.userRepository.save(user);
    }
}
