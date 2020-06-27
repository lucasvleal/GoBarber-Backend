import User from '../models/Users';

declare namespace Express {
    export interface Request {
        user: {
            id: string;
        };
    }
}
