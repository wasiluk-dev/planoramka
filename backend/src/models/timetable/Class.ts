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
            select: '_id fullName', // TODO: add title later
        },
        default: null,
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
        autopopulate: {
            select: '_id name shortName',
        },
        default: null,
    },
    classType: {
        type: Schema.Types.ObjectId,
        ref: new ClassType().name,
        autopopulate: true,
        required: true,
    },
    weekday: {
        type: Number,
        min: 0,
        max: 6,
        validate: {
            validator: Number.isInteger,
        },
        required: true,
    },
    periodBlocks: {
        type: [{
            type: Number,
            min: 1,
            validate: {
                validator: Number.isInteger,
            },
        }],
        default: [],
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: new Room().name,
        autopopulate: true,
        required: true,
    },
    semester: {
        type: Schema.Types.ObjectId,
        ref: new Semester().name,
        default: null,
    },
    studentGroups: {
        type: [{
            type: Number,
            min: 1,
            validate: {
                validator: Number.isInteger,
            },
        }],
        default: null,
    },
} as const;
export const ClassSchema = new Schema(ClassDefinition);

export default class Class extends Base<HydratedDocumentFromSchema<typeof ClassSchema>> {
    constructor() {
        super('Class', ClassSchema);
    }
}
