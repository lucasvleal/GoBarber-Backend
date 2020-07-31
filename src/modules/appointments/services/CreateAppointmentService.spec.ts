import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 6, 30, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 6, 30, 13),
            provider_id: 'provider-id',
            user_id: 'user-id',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('provider-id');
    });

    it('should not be able to create two appointment on the same time', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 6, 30, 12).getTime();
        });

        const date = new Date(2020, 6, 30, 13);

        await createAppointment.execute({
            date,
            provider_id: 'provider-id',
            user_id: 'user-id',
        });

        await expect(
            createAppointment.execute({
                date,
                provider_id: 'provider-id',
                user_id: 'user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 6, 30, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 6, 30, 10),
                provider_id: 'provider-id',
                user_id: 'user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with yourself', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 6, 30, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 6, 30, 13),
                provider_id: 'equal-id',
                user_id: 'equal-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment out of the range of hours', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 6, 30, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 6, 31, 7),
                provider_id: 'provider-id',
                user_id: 'user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 6, 31, 18),
                provider_id: 'provider-id',
                user_id: 'user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
