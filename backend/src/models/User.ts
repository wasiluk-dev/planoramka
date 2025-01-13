import { CallbackWithoutResultAndOptionalError, HydratedDocumentFromSchema, Schema } from 'mongoose';

import EUserRole from '../enums/EUserRole';
import StringUtils from '../utils/StringUtils';
import Base from './Base';
import Course from './courses/Course';

function usernameValidator(username: string) {
    return username.length >= 3;
}
function passwordValidator(password: string) {
    return password.length >= 8;
}

export const UserDefinition = {
    username: {
        type: String,
        unique: true,
        validate: {
            validator: usernameValidator,
            message: 'db_user_username_invalid',
        },
    },
    password: {
        type: String,
        validate: {
            validator: passwordValidator,
            message: 'db_user_password_invalid',
        },
    },
    names: {
        type: String,
    },
    surnames: {
        type: String,
    },
    title: {
        type: String,
    },
    // email: {
    //     type: String,
    //     required: true,
    //     index: {
    //         unique: true,
    //         sparse: true,
    //     },
    //     // match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, TODO: choose a sensible regex
    // },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: new Course().name,
    }],
    role: {
        type: Number,
        enum: EUserRole,
    },
} as const;
export const UserSchema = new Schema(UserDefinition);

UserSchema.path('username').required(true, 'db_user_username_required');
UserSchema.path('password').required(true, 'db_user_password_required');
UserSchema.path('names').required(true, 'db_user_names_required');
UserSchema.path('surnames').required(true, 'db_user_surnames_required');
UserSchema.path('title').default(null);
UserSchema.path('courses').default([]);
UserSchema.path('role').default(EUserRole.Student);

UserSchema.pre('save', function(next: CallbackWithoutResultAndOptionalError) {
    if (!this.password || !this.isModified('password')) return next();

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
