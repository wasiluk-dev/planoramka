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

    static async create<T extends Document>(model: Model<T>, documents: T[]): Promise<HydratedDocument<T>[]> {
        const savedDocuments: HydratedDocument<T>[] = [];
        for (const d of documents) {
            new model(d).save()
                .then((hd: HydratedDocument<T>) => {
                    savedDocuments.push(hd);
                })
                .catch((err) => {
                    throw err;
                });
        }

        return savedDocuments;
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
