import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { injectable, inject } from 'tsyringe';

import mailConfig from '@config/mail';
import IMailProvider from '../models/IMailProvider';
import ISendMailTemplateDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplate: IMailTemplateProvider,
    ) {
        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
            }),
        });
    }

    public async sendMail({
        to,
        subject,
        from,
        templateData,
    }: ISendMailTemplateDTO): Promise<void> {
        const { email, name } = mailConfig.defaults.from;

        await this.client.sendMail({
            from: {
                name: from?.name || name,
                address: from?.email || email,
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await this.mailTemplate.parse(templateData),
        });
    }
}
