import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Semester from '../courses/Semester';
import Subject from '../courses/Subject';
import Room from '../faculty/Room';
import User from '../User';
import ClassType from './ClassType';

function weekdayValidator(weekday: number) {
    return Number.isInteger(weekday) && weekday >= 0 && weekday <= 6;
}

function biggerThanZeroValidator(periodBlock: number) {
    return Number.isInteger(periodBlock) && periodBlock >= 1;
}

export const ClassSchema = new Schema({
    // TODO: add error message to required fields
    organizer: {
        type: Schema.Types.ObjectId,
        ref: new User().name,
        autopopulate: {
            select: '_id names surnames', // TODO: add title later
        },
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
        autopopulate: {
            select: '_id name shortName',
        },
    },
    classType: {
        type: Schema.Types.ObjectId,
        ref: new ClassType().name,
        autopopulate: true,
    },
    weekday: {
        type: Number,
        validate: {
            validator: weekdayValidator,
            message: 'db_class_weekday_invalid',
        },
    },
    periodBlocks: {
        type: [{
            type: Number,
            validate: {
                validator: biggerThanZeroValidator,
                message: 'db_class_periodBlocks_invalid',
            },
        }],
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: new Room().name,
        autopopulate: true,
    },
    semester: {
        type: Schema.Types.ObjectId,
        ref: new Semester().name,
    },
    studentGroups: {
        type: [{
            type: Number,
            validate: {
                validator: biggerThanZeroValidator,
                message: 'db_class_studentGroups_invalid',
            },
        }],
    },
});

ClassSchema.path('organizer').default(null);
ClassSchema.path('subject').default(null);
ClassSchema.path('classType').required(true, 'db_class_type_required')
ClassSchema.path('weekday').required(true, 'db_class_weekday_required')
ClassSchema.path('periodBlocks').default([]);
ClassSchema.path('room').required(true, 'db_class_room_required');
ClassSchema.path('semester').default(null);
ClassSchema.path('studentGroups').default([]);

export default class Class extends Base<HydratedDocumentFromSchema<typeof ClassSchema>> {
    constructor() {
        super('Class', ClassSchema);
    }
}
