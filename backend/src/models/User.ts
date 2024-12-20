import { CallbackWithoutResultAndOptionalError, HydratedDocumentFromSchema, Schema } from 'mongoose';

import EUserRole from '../enums/EUserRole';
import StringUtils from '../utils/StringUtils';
import Base from './Base';
import Course from './courses/Course';

export const UserDefinition = {
    username: {
        type: String,
        minLength: 3,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minLength: 8,
        required: true,
    },
    names: {
        type: String,
        required: true,
    },
    surnames: {
        type: String,
        required: true,
    },
    // title: {
    //     type: Number,
    //     enum: EUserTitle,
    // },
    // email: {
    //     type: String,
    //     required: true,
    //     index: {
    //         unique: true,
    //         sparse: true,
    //     },
    //     // match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, TODO: choose a sensible regex
    // },
    courses: {
        type: [Schema.Types.ObjectId],
        ref: new Course().name,
        default: [],
    },
    role: {
        type: Number,
        enum: EUserRole,
        default: EUserRole.Student,
    },
} as const;
export const UserSchema = new Schema(UserDefinition);

UserSchema.pre('save', function(next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) return next();

    StringUtils.hash(this.password)
        .then((hashedPassword: string) => {
            this.password = hashedPassword;
            return next();
        })
        .catch(err => next(err));
});

export default class User extends Base<HydratedDocumentFromSchema<typeof UserSchema>> {
    constructor() {
        super('User', UserSchema);
    }
}
