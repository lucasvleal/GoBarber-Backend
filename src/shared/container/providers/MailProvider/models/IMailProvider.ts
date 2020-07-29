import ISendMailTemplateDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
    sendMail(data: ISendMailTemplateDTO): Promise<void>;
}
