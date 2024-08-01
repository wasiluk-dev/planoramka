import { Request, Response } from 'express';

import DBUtils from '../utils/DBUtils';
import EHttpStatusCode from '../enums/EHttpStatusCode'
import { UserDocument, UserModel } from '../schemas/UserSchema';
import DBResult from '../types/DBResult';

export const getAllUsers = async (res: Response) => {
    await DBUtils.find<UserDocument>(UserModel)
        .then((result: DBResult<UserDocument>) => res.status(result.code).json(result.body))
        .catch(err => res.status(EHttpStatusCode.InternalServerError).json(err));
};

export const createUser = async (body: UserDocument, res: Response) => {
    await DBUtils.create<UserDocument>(UserModel, body)
        .then((result: DBResult<UserDocument>) => res.status(result.code).json(result.body))
        .catch(err => res.status(EHttpStatusCode.InternalServerError).json(err));
}

export const getUser = async (req: Request, res: Response) => {
    await DBUtils.find<UserDocument>(UserModel, req.params.userId)
        .then((result: DBResult<UserDocument>) => res.status(result.code).json(result.body))
        .catch(err => res.status(EHttpStatusCode.InternalServerError).json(err));
};

export const updateUser = async (req: Request, res: Response) => {
    await DBUtils.update<UserDocument>(UserModel, req.params.userId, req.query)
        .then((result: DBResult<UserDocument>) => res.status(result.code).json(result.body))
        .catch(err => res.status(EHttpStatusCode.InternalServerError).json(err));
};

export const deleteUser = async (req: Request, res: Response) => {
    await DBUtils.delete<UserDocument>(UserModel, req.params.userId)
        .then((result: DBResult<UserDocument>) => res.status(result.code).json(result.body))
        .catch(err => res.status(EHttpStatusCode.InternalServerError).json(err));
};
