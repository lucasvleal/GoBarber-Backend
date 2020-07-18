import User from '../modules/users/infra/typeorm/entities/User';

declare namespace Express {
    export interface Request {
        user: {
            id: string;
        };
    }
}
