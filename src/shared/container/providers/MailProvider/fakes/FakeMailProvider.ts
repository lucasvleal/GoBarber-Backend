import IMailProvider from '../models/IMailProvider';
import ISendMailTemplateDTO from '../dtos/ISendMailDTO';

export default class FakeMailProvider implements IMailProvider {
    private messages: ISendMailTemplateDTO[] = [];

    public async sendMail(message: ISendMailTemplateDTO): Promise<void> {
        this.messages.push(message);
    }
}
