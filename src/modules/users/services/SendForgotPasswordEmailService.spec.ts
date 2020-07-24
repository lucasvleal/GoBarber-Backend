import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokenRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokenRepository = new FakeUserTokenRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokenRepository,
        );
    });

    it('should be able to recover password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'Lucas Leal',
            email: 'lucas@gmail.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'lucas@gmail.com',
        });

        // expect(sendMail).toHaveBeenCalledWith('lucas@gmail.com');
        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non existing user password', async () => {
        await expect(
            sendForgotPasswordEmail.execute({
                email: 'lucas@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to generate a forgot password token', async () => {
        const generate = jest.spyOn(fakeUserTokenRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'Lucas Leal',
            email: 'lucas@gmail.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({
            email: 'lucas@gmail.com',
        });

        expect(generate).toHaveBeenCalledWith(user.id);
    });
});
