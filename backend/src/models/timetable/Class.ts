import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Subject from '../courses/Subject';
import Room from '../faculty/Room';
import User from '../User';
import ClassType from './ClassType';

export const ClassSchema = new Schema({
    organizer: {
        type: Schema.Types.ObjectId,
        ref: new User().name,
        autopopulate: {
            // need to select fields with the data (first/middle/last) for the virtual (full) to work properly
            select: 'firstName middleName lastName fullName', // TODO: add title later
        },
        required: true,
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
        autopopulate: {
            select: 'name shortName',
        },
    },
    classType: {
        type: Schema.Types.ObjectId,
        ref: new ClassType().name,
        autopopulate: true,
    },
    periodBlocks: [{
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
        },
    }],
    weekday: {
        type: Number,
        required: true,
        min: 0,
        max: 6,
        validate: {
            validator: Number.isInteger,
        },
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
        autopopulate: true,
        required: true,
    },
});

class Class extends Base<HydratedDocumentFromSchema<typeof ClassSchema>> {
    constructor() {
        super('Class', ClassSchema);
    }
}

export default Class;
