import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Semester from '../courses/Semester';
import Class from './Class';
import ClassType from './ClassType';
import Schedule from './Schedule';

export const TimetableDefinition = {
    semester: {
        type: Schema.Types.ObjectId,
        ref: new Semester().name,
    },
    targetedSemester: {
        type: Number,
        min: 1,
        validate: {
            validator: Number.isInteger,
        },
    },
    weekdays: [{
        type: Number,
        required: true,
        min: 0,
        max: 6,
        validate: {
            validator: Number.isInteger,
        },
    }],
    schedules: [{
        type: Schema.Types.ObjectId,
        ref: new Schedule().name,
        autopopulate: true,
    }],
    groups: [{
        _id: false,
        classType: {
            type: Schema.Types.ObjectId,
            ref: new ClassType().name,
            autopopulate: {
                select: 'name acronym',
            },
            required: true,
        },
        groupCount: {
            type: Number,
            min: 1,
            validate: {
                validator: Number.isInteger,
            },
        }
    }],
    classes: [{
        type: Schema.Types.ObjectId,
        ref: new Class().name,
        autopopulate: true,
    }],
} as const;
export const TimetableSchema = new Schema(TimetableDefinition);

export default class Timetable extends Base<HydratedDocumentFromSchema<typeof TimetableSchema>> {
    constructor() {
        super('Timetable', TimetableSchema);
    }
}
