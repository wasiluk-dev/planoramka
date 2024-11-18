import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Semester from '../courses/Semester';
import Subject from '../courses/Subject';
import Room from '../faculty/Room';
import User from '../User';
import ClassType from './ClassType';

export const ClassDefinition = {
    organizer: {
        type: Schema.Types.ObjectId,
        ref: new User().name,
        autopopulate: {
            select: 'fullName', // TODO: add title later
        },
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
        required: true,
    },
    weekday: {
        type: Number,
        required: true,
        min: 0,
        max: 6,
        validate: {
            validator: Number.isInteger,
        },
    },
    periodBlocks: [{
        type: Number,
        required: true,
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
    semester: {
        type: Schema.Types.ObjectId,
        ref: new Semester().name,
        required: true,
    },
    studentGroups: [{
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
        },
    }],
} as const;
export const ClassSchema = new Schema(ClassDefinition);

export default class Class extends Base<HydratedDocumentFromSchema<typeof ClassSchema>> {
    constructor() {
        super('Class', ClassSchema);
    }
}
