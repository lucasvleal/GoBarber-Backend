import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to authenticate', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Lucas Leal',
            email: 'lucas@gmail.com',
            password: '123456',
        });

        const auth = await authenticateUser.execute({
            email: 'lucas@gmail.com',
            password: '123456',
        });

        expect(auth).toHaveProperty('token');
        expect(auth.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        await expect(
            authenticateUser.execute({
                email: 'lucas@gmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to authenticate with wrong password', async () => {
        await fakeUsersRepository.create({
            name: 'Lucas Leal',
            email: 'lucas@gmail.com',
            password: '123456',
        });

        await expect(
            authenticateUser.execute({
                email: 'lucas@gmail.com',
                password: '123478',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
