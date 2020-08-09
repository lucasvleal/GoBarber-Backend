import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
    provider_id: string;
    month: number;
    year: number;
}

type Response = Array<{
    day: number;
    avaliable: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        month,
        year,
    }: Request): Promise<Response> {
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
            {
                provider_id,
                month,
                year,
            },
        );

        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

        const eachDay = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        );

        const availability = eachDay.map(day => {
            const compareDate = new Date(year, month - 1, day, 23, 59, 59);

            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day;
            });

            return {
                day,
                avaliable:
                    isAfter(compareDate, new Date()) &&
                    appointmentsInDay.length < 10,
            };
        });

        return availability;
    }
}
