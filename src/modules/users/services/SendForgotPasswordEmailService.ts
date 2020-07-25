import { inject, injectable } from 'tsyringe';

// import User from '../infra/typeorm/entities/User';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface Request {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,
    ) {}

    public async execute({ email }: Request): Promise<void> {
        const userExists = await this.userRepository.findByEmail(email);

        if (!userExists) {
            throw new AppError('User does not exists.');
        }

        const { token } = await this.userTokenRepository.generate(
            userExists.id,
        );

        await this.mailProvider.sendMail(
            email,
            `Pedido de recuperação de senha recebido: ${token}`,
        );
    }
}

export default SendForgotPasswordEmailService;
