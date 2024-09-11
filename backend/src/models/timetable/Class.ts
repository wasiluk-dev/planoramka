import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Subject from '../courses/Subject';
import Room from '../faculty/Room';
import User from '../User';
import ClassType from './ClassType';
import Period from './Period';

export const ClassSchema = new Schema({
    organizer: {
        type: Schema.Types.ObjectId,
        ref: new User().name,
        required: true,
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
    },
    classType: {
        type: Schema.Types.ObjectId,
        ref: new ClassType().name,
    },
    studentGroups: [{
        type: Number,
        min: 1,
        validate: {
            validator: Number.isInteger,
        },
    }],
    room: {
        type: Schema.Types.ObjectId,
        ref: new Room().name,
        required: true,
    },
    periods: [{
        type: Schema.Types.ObjectId,
        ref: new Period().name,
        required: true,
    }],
});

class Class extends Base<HydratedDocumentFromSchema<typeof ClassSchema>> {
    constructor() {
        super('Class', ClassSchema);
    }
}

export default Class;
