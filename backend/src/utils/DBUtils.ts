import { Document, HydratedDocument, Model } from 'mongoose';

import DBResult from '../types/DBResult';
import EHttpStatusCode from '../enums/EHttpStatusCode';

export default class DBUtils {
    private static validate<T>(doc: Array<HydratedDocument<T>> | HydratedDocument<T> | null): DBResult<T> {
        if (!doc) return { code: EHttpStatusCode.NotFound };
        if (doc instanceof Array && doc.length === 1) return { code: EHttpStatusCode.Ok, body: doc[0] };
        return { code: EHttpStatusCode.Ok, body: doc };
    }

    static async find<T extends Document>(model: Model<T>, id?: string): Promise<DBResult<T>> {
        return await model.find(id ? { _id: id } : {}).exec()
            .then((doc: Array<HydratedDocument<T>>): DBResult<T> => {
                return this.validate(doc);
            })
            .catch((err: string) => {
                throw new Error(err);
            });
    }

    static async create<T extends Document>(model: Model<T>, body: T): Promise<DBResult<T>> {
        return new model(body).save()
            .then((doc: HydratedDocument<T>): DBResult<T> => {
                return this.validate(doc);
            })
            .catch((err: string) => {
                throw new Error(err);
            });
    }

    static async update<T extends Document>(model: Model<T>, id: string, update: Partial<T>): Promise<DBResult<T>> {
        return await model.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec()
            .then((updatedDoc: HydratedDocument<T> | null): DBResult<T> => {
                return this.validate(updatedDoc);
            })
            .catch((err: string) => {
                throw new Error(err);
            });
    }

    static async delete<T extends Document>(model: Model<T>, id: string): Promise<DBResult<T>> {
        return await model.findByIdAndDelete(id).exec()
            .then((deletedDoc: HydratedDocument<T> | null): DBResult<T> => {
                return this.validate(deletedDoc);
            })
            .catch((err: string) => {
                throw new Error(err);
            });
    }
}
