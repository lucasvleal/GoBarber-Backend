import 'reflect-metadata';

// import AppError from '@shared/errors/AppError';
import ListProviderDayAvaliabilityService from './ListProviderDayAvaliabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderAviability: ListProviderDayAvaliabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderDayAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAviability = new ListProviderDayAvaliabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the day availability from provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'provider',
            date: new Date(2020, 6, 29, 14, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'provider',
            date: new Date(2020, 6, 29, 15, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 6, 29, 11).getTime();
        });

        const avaliability = await listProviderAviability.execute({
            provider_id: 'provider',
            year: 2020,
            month: 7,
            day: 29,
        });

        expect(avaliability).toEqual(
            expect.arrayContaining([
                { hour: 8, avaliable: false },
                { hour: 9, avaliable: false },
                { hour: 10, avaliable: false },
                { hour: 14, avaliable: false },
                { hour: 15, avaliable: false },
                { hour: 15, avaliable: false },
                { hour: 16, avaliable: true },
            ]),
        );
    });
});
