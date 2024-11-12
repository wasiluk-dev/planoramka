import argon2 from 'argon2';
import { CallbackWithoutResultAndOptionalError, HydratedDocumentFromSchema, Schema } from 'mongoose';

import EUserRole from '../enums/EUserRole';
import Base from './Base';
import Course from './courses/Course';

export const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: 3,
    },
    password: {
        type: String,
        minLength: 8,
    },
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true,
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: new Course().name,
    }],
    role: {
        type: Number,
        enum: EUserRole,
        default: EUserRole.Student,
    },
});

UserSchema.virtual('fullName')
    .get(function() {
        if (!this.firstName && !this.middleName && !this.lastName) {
            return null;
        }

        return `${this.firstName}${(this.middleName) ? ` ${this.middleName}` : ''} ${this.lastName}`;
    });

class User extends Base<HydratedDocumentFromSchema<typeof UserSchema>> {
    constructor() {
        super('User', UserSchema);
        this.schema.pre('save', function(next: CallbackWithoutResultAndOptionalError) {
            if (!this.password || !this.isModified('password')) return next();

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
