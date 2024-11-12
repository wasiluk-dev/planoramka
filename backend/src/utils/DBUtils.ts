import { DeleteResult } from 'mongodb';
import { Document, FilterQuery, HydratedDocument, Model, UpdateWriteOpResult } from 'mongoose';

export default class DBUtils {
    static async find<T extends Document>(model: Model<T>, filter: FilterQuery<T> = {}): Promise<Array<HydratedDocument<T>>> {
        return await model.find(filter).select('-__v').exec()
            .then((docs: Array<HydratedDocument<T>>) => {
                return docs;
            })
            .catch((err) => {
                throw err;
            });
    }

    static async create<T extends Document>(model: Model<T>, document: T): Promise<HydratedDocument<T>> {
        return new model(document).save()
            .then((doc: HydratedDocument<T>) => {
                return doc;
            })
            .catch((err) => {
                throw err;
            });
    }

    // TODO: implement validation
    static async update<T extends Document>(model: Model<T>, filter: FilterQuery<T>, update: Partial<T>): Promise<UpdateWriteOpResult> {
        return await model.updateMany(filter, update).exec()
            .then((result: UpdateWriteOpResult) => {
                return result;
            })
            .catch((err) => {
                throw err;
            });
    }

    static async delete<T extends Document>(model: Model<T>, filter: FilterQuery<T>): Promise<DeleteResult> {
        return await model.deleteMany(filter).exec()
            .then((result: DeleteResult) => {
                return result;
            })
            .catch((err) => {
                throw err;
            });
    }
}
