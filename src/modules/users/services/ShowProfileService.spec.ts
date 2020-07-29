import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able to show profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Lucas Leal',
            email: 'lucas@gmail.com',
            password: '123456',
        });

        const userShown = await showProfile.execute({
            user_id: user.id,
        });

        expect(userShown.id).toBe(user.id);
        expect(userShown.name).toBe(user.name);
        expect(userShown.email).toBe(user.email);
    });

    it('should not be able to show profile from non-existing user', async () => {
        await expect(
            showProfile.execute({
                user_id: 'non-existing-user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
