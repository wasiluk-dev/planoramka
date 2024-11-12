import argon2 from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { InferRawDocType } from 'mongoose';

import EHttpStatusCode from '../enums/EHttpStatusCode';
import EUserRole from '../enums/EUserRole';
import User, { UserDefinition } from '../models/User';

declare module 'express-session' {
    interface SessionData {
        user?: Partial<InferRawDocType<typeof UserDefinition>>;
        isAuthenticated?: boolean;
    }
}

export default class AuthController {
    static validateCredentials = async (
        username: string,
        password: string,
    ): Promise<boolean> => {
        return new User().find({ username: username })
            .then(async (users) => {
                if (users.length !== 1) throw new Error('Could not find a user with the specified username.');
                return await argon2.verify(users[0].password, password);
            })
            .catch((err) => {
                throw err;
            });
    }

    static confirmPermissions = (
        role: EUserRole,
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        if ((role === EUserRole.Guest) || (req.session.user && req.session.user.role === role)) {
            return next();
        }

        res.sendStatus(EHttpStatusCode.Forbidden);
    }

    static isAuthenticated = (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        if (req.session.isAuthenticated) {
            return next();
        }

        res.sendStatus(EHttpStatusCode.Unauthorized);
    }
}
