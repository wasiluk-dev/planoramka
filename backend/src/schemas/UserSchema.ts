import argon2 from 'argon2';
import { HydratedDocumentFromSchema, InferSchemaType, model, Model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import EUserType from '../enums/EUserType';

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: 3,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    name: String,
    surname: String,
    email: {
        type: String,
        index: {
            unique: true,
            sparse: true,
        },
        // match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, TODO: choose a sensible regex
    },
    type: {
        type: Number,
        enum: EUserType,
        default: EUserType.Student,
    }
});

UserSchema.plugin(uniqueValidator);
UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();

    argon2.hash(this.password)
        .then((hashedPassword: string) => {
            this.password = hashedPassword;
            return next();
        })
        .catch(err => next(err));
});

export type User = InferSchemaType<typeof UserSchema>;
export type UserDocument = HydratedDocumentFromSchema<typeof UserSchema>;
export const UserModel: Model<UserDocument> = model<UserDocument>('User', UserSchema);
export default UserSchema;
