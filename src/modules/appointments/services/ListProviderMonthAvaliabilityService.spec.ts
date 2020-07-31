import 'reflect-metadata';

// import AppError from '@shared/errors/AppError';
import ListProviderMonthAvaliabilityService from './ListProviderMonthAvaliabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderAviability: ListProviderMonthAvaliabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAviability = new ListProviderMonthAvaliabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the month availability from provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'provider',
            date: new Date(2020, 6, 29, 8, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'provider',
            date: new Date(2020, 6, 29, 9, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'provider',
            date: new Date(2020, 6, 29, 10, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'provider',
            date: new Date(2020, 6, 29, 11, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'provider',
            date: new Date(2020, 6, 29, 12, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'provider',
            date: new Date(2020, 6, 29, 13, 0, 0),
        });

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

        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'provider',
            date: new Date(2020, 6, 29, 16, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'provider',
            date: new Date(2020, 6, 29, 17, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'provider',
            date: new Date(2020, 6, 30, 6, 0, 0),
        });

        const avaliability = await listProviderAviability.execute({
            provider_id: 'provider',
            year: 2020,
            month: 7,
        });

        expect(avaliability).toEqual(
            expect.arrayContaining([
                { day: 28, avaliable: true },
                { day: 29, avaliable: false },
                { day: 30, avaliable: true },
                { day: 31, avaliable: true },
            ]),
        );
    });
});
