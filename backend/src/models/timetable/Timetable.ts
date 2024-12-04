import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Semester from '../courses/Semester';
import Class from './Class';
import ClassType from './ClassType';
import Schedule from './Schedule';
import EDayOfTheWeek from '../../enums/EDayOfTheWeek';

export const TimetableDefinition = {
    semester: {
        type: Schema.Types.ObjectId,
        ref: new Semester().name,
        required: true,
    },
    weekdays: [{
        type: Number,
        enum: EDayOfTheWeek,
        required: true,
    }],
    schedules: [{
        type: Schema.Types.ObjectId,
        ref: new Schedule().name,
        autopopulate: true,
        required: true,
    }],
    groups: {
        _id: false,
        type: [{
            classType: {
                type: Schema.Types.ObjectId,
                ref: new ClassType().name,
                autopopulate: {
                    select: '-color',
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
        default: null,
    },
    classes: {
        type: [Schema.Types.ObjectId],
        ref: new Class().name,
        autopopulate: true,
    },
} as const;
export const TimetableSchema = new Schema(TimetableDefinition);

export default class Timetable extends Base<HydratedDocumentFromSchema<typeof TimetableSchema>> {
    constructor() {
        super('Timetable', TimetableSchema);
    }
}
