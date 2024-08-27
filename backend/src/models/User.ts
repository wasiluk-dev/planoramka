import argon2 from 'argon2';
import { CallbackWithoutResultAndOptionalError, HydratedDocumentFromSchema, Schema } from 'mongoose';

import EUserType from '../enums/EUserType';
import Base from './Base';
import { CourseSchema } from './courses/Course';

export const UserSchema = new Schema({
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
        required: true,
        // match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, TODO: choose a sensible regex
    },
    type: {
        type: Number,
        enum: EUserType,
        default: EUserType.Student,
    },
    courses: {
        type: [CourseSchema],
    },
});

class User extends Base<HydratedDocumentFromSchema<typeof UserSchema>> {
    constructor() {
        super('User', UserSchema);
        this.schema.pre('save', function(next: CallbackWithoutResultAndOptionalError) {
            if (!this.isModified('password')) return next();

            argon2.hash(this.password)
                .then((hashedPassword: string) => {
                    this.password = hashedPassword;
                    return next();
                })
                .catch(err => next(err));
        });
    }
}

export default User;
