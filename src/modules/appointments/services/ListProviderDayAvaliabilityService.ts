import { inject, injectable } from 'tsyringe';
import { isAfter, getHours } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

type Response = Array<{
    hour: number;
    avaliable: boolean;
}>;

@injectable()
export default class ListProviderDayAvaliabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        month,
        year,
        day,
    }: Request): Promise<Response> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                provider_id,
                year,
                month,
                day,
            },
        );

        const startHour = 8;

        const eachHour = Array.from(
            { length: 10 },
            (_, index) => index + startHour,
        );

        const currentDate = new Date(Date.now());

        const availability = eachHour.map(hour => {
            const hasAppointmentInHour = appointments.find(
                appointment => getHours(appointment.date) === hour,
            );

            const compareFullDate = new Date(year, month - 1, day, hour);

            return {
                hour,
                avaliable:
                    !hasAppointmentInHour &&
                    isAfter(compareFullDate, currentDate),
            };
        });

        return availability;
    }
}
