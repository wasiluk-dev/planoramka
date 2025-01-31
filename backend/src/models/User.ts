import { CallbackError, CallbackWithoutResultAndOptionalError, HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from './Base';
import EUserRole from '../enums/EUserRole';
import StringUtils from '../utils/StringUtils';

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
UserSchema.path('role').default(EUserRole.Student);
UserSchema.virtual('fullName')
    .get(function(): string {
        return `${ this.names } ${ this.surnames }`;
    });
UserSchema.virtual('fullNameReversed')
    .get(function(): string {
        return `${ this.surnames } ${ this.names }`;
    });
UserSchema.virtual('fullNameWithTitle')
    .get(function(): string {
        return `${ this.title } ${ this.names } ${ this.surnames }`;
    });

UserSchema.pre('save', function(next: CallbackWithoutResultAndOptionalError) {
    if (!this.password || !this.isModified('password')) return next();

    StringUtils.hash(this.password)
        .then((hashedPassword: string) => {
            this.password = hashedPassword;
            return next();
        })
        .catch(err => next(err));
});
UserSchema.pre('updateMany', async function(next) {
    const update = this.getUpdate();

    if (update && typeof update === 'object' && 'password' in update) {
        try {
            const updateObj = update as Record<string, any>;
            updateObj.password = await StringUtils.hash(updateObj.password);
            this.setUpdate(updateObj);
        } catch (err) {
            return next(err as CallbackError);
        }
    }
    next();
});



export default class User extends Base<HydratedDocumentFromSchema<typeof UserSchema>> {
    constructor() {
        super('User', UserSchema);
    }
}
