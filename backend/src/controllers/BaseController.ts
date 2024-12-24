import { Response } from 'express';
import { DeleteResult, UpdateResult } from 'mongodb';
import { Document, FilterQuery } from 'mongoose';

import EHttpStatusCode from '../enums/EHttpStatusCode';
import Base from '../models/Base';

export default abstract class BaseController<T extends Document> {
    private readonly _base: Base<T>;

    protected constructor(base: Base<T>) {
        this._base = base;
    }

    // GET /documents
    getByFilter = (response: Response, filter: FilterQuery<T>): void => {
        this._base.find(filter)
            .then(result => {
                response.status(EHttpStatusCode.Ok).json(result);
            })
            .catch(err => {
                response.status(EHttpStatusCode.InternalServerError).json(err)
            });
    };

    // PATCH /documents
    patchByFilter = (
        response: Response,
        filter: FilterQuery<T>,
        update: Partial<T>
    ): void => {
        this._base.update(filter, update)
            .then((result): void => {
                this.patch(response, result);
            })
            .catch(err => {
                response.status(EHttpStatusCode.InternalServerError).json(err)
            });
    }

    // DELETE /documents
    deleteByFilter = (
        response: Response,
        filter: FilterQuery<T>
    ): void => {
        this._base.delete(filter)
            .then((result: DeleteResult): void => {
                this.delete(response, result);
            })
            .catch(err => {
                response.status(EHttpStatusCode.InternalServerError).json(err)
            });
    }

    // GET /documents/:documentId
    getById = (response: Response, id: string): void => {
        this._base.find({ _id: id })
            .then(result => {
                response.status(EHttpStatusCode.Ok).json(result);
            })
            .catch(err => {
                response.status(EHttpStatusCode.InternalServerError).json(err)
            });
    }

    // PATCH /documents/:documentId
    patchById = (response: Response, id: string, update: Partial<T>): void => {
        this._base.update({ _id: id }, update)
            .then((result: UpdateResult): void => {
                this.patch(response, result);
            })
            .catch(err => {
                response.status(EHttpStatusCode.InternalServerError).json(err)
            });
    }

    // DELETE /documents/:documentId
    deleteById = (response: Response, id: string): void => {
        this._base.delete({ _id: id })
            .then((result: DeleteResult): void => {
                this.delete(response, result);
            })
            .catch(err => {
                response.status(EHttpStatusCode.InternalServerError).json(err)
            });
    }

    // POST /documents
    post(response: Response, documents: T | T[]) {
        this._base.create(documents)
            .then((result) => {
                response.status(EHttpStatusCode.Created).json(result);
            })
            .catch(err => {
                response.status(EHttpStatusCode.InternalServerError).json(err)
            });
    }

    protected patch(response: Response, result: UpdateResult): void {
        if (!result.acknowledged || result.matchedCount !== result.modifiedCount) {
            response.status(EHttpStatusCode.InternalServerError).json(result);
        } else if (result.matchedCount === 0) {
            response.status(EHttpStatusCode.NotFound).json(result);
        } else {
            response.status(EHttpStatusCode.Ok).json(result);
        }
    }

    protected delete(response: Response, result: DeleteResult): void {
        if (!result.acknowledged) {
            response.status(EHttpStatusCode.InternalServerError).json(result);
        } else if (result.deletedCount === 0) {
            response.status(EHttpStatusCode.NotFound).json(result);
        } else {
            response.status(EHttpStatusCode.Ok).json(result);
        }
    }

    get base(): Base<T> {
        return this._base;
    }
}
