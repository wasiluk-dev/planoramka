import { DeleteResult } from 'mongodb';
import { Document, FilterQuery, HydratedDocument, Model } from 'mongoose';

export default class DBUtils {
    static async find<T>(model: Model<T>, filter: FilterQuery<T>): Promise<Array<HydratedDocument<T>>> {
        return await model.find(filter).exec()
            .then((docs: Array<HydratedDocument<T>>) => {
                return docs;
            })
            .catch((err: string) => {
                throw new Error(err);
            });
    }

    static async create<T extends Document>(model: Model<T>, document: T): Promise<HydratedDocument<T>> {
        return new model(document).save()
            .then((doc: HydratedDocument<T>) => {
                return doc;
            })
            .catch((err: string) => {
                throw new Error(err);
            });
    }

    // TODO: implement validation
    static async update<T>(model: Model<T>, filter: FilterQuery<T>, update: Partial<T>) {
        return await model.updateMany(filter, update).exec()
            .then((result) => {
                return result;
            })
            .catch((err: string) => {
                throw new Error(err);
            });
    }

    static async delete<T>(model: Model<T>, filter: FilterQuery<T>): Promise<DeleteResult> {
        return await model.deleteMany(filter).exec()
            .then((result: DeleteResult) => {
                return result;
            })
            .catch((err: string) => {
                throw new Error(err);
            });
    }
}
