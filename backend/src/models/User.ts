import { CallbackWithoutResultAndOptionalError, HydratedDocumentFromSchema, Schema } from 'mongoose';

import EUserRole from '../enums/EUserRole';
import StringUtils from '../utils/StringUtils';
import Base from './Base';
import Course from './courses/Course';

export const UserDefinition = {
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
    fullName: {
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
