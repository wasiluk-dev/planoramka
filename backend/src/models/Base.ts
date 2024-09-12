import { DeleteResult } from 'mongodb';
import { Document, FilterQuery, model, Model, Schema } from 'mongoose';
import mongoose_autopopulate from 'mongoose-autopopulate';
import uniqueValidator from 'mongoose-unique-validator';

import DBUtils from '../utils/DBUtils';

abstract class Base<T extends Document> {
    private readonly _name: string;
    private readonly _schema: Schema<T>;
    private readonly _model: Model<T>;

    protected constructor(name: string, schema: Schema<T>) {
        this._name = name;

        this._schema = schema;
        this._schema.set('id', false);
        this._schema.set('toJSON', {
            versionKey: false,
            virtuals: true,
        });
        this._schema.set('toObject', {
            versionKey: false,
            virtuals: true,
        });

        this._schema.plugin(mongoose_autopopulate);
        this._schema.plugin(uniqueValidator);

        this._model = model<T>(this._name, this._schema);
    }

    find = (filter: FilterQuery<T> = {}) =>
        DBUtils.find(this._model, filter)
            .then((result) => {
                return result;
            });

    create = (body: T) =>
        DBUtils.create(this._model, body)
            .then((result) => {
                return result;
            });

    update = (filter: FilterQuery<T>, update: Partial<T>) =>
        DBUtils.update(this._model, filter, update)
            .then((result) => {
                return result;
            });

    delete = (filter: FilterQuery<T>) =>
        DBUtils.delete(this._model, filter)
            .then((result: DeleteResult) => {
            return result;
        });

    get name(): string {
        return this._name;
    }
    get schema(): Schema<T> {
        return this._schema;
    }
    get model(): Model<T> {
        return this._model;
    }
}

export default Base;
