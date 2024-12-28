import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Semester from '../courses/Semester';
import Class from './Class';
import ClassType from './ClassType';
import Schedule from './Schedule';
import EDayOfTheWeek from '../../enums/EDayOfTheWeek';

function groupCountValidator(groupCount: number) {
    return Number.isInteger(groupCount) && groupCount >= 1;
}

export const TimetableSchema = new Schema({
    semester: {
        type: Schema.Types.ObjectId,
        ref: new Semester().name,
    },
    weekdays: [{
        type: Number,
        enum: EDayOfTheWeek,
    }],
    schedules: [{
        type: Schema.Types.ObjectId,
        ref: new Schedule().name,
        autopopulate: true,
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
            },
            groupCount: {
                type: Number,
                validate: {
                    validator: groupCountValidator,
                    message: 'db_timetable_groups_groupCount_invalid',
                },
            },
        }],
    },
    classes: [{
        type: Schema.Types.ObjectId,
        ref: new Class().name,
        autopopulate: true,
    }],
});

TimetableSchema.path('semester').required(true, 'db_timetable_semester_required');
TimetableSchema.path('weekdays').required(true, 'db_timetable_weekdays_required');
TimetableSchema.path('schedules').required(true, 'db_timetable_schedules_required');
TimetableSchema.path('groups').default(null);
TimetableSchema.path('groups.classType').required(true, 'db_timetable_groups_classType_required');
TimetableSchema.path('groups.groupCount').required(true, 'db_timetable_groups_groupCount_required');
TimetableSchema.path('classes').default([]);

export default class Timetable extends Base<HydratedDocumentFromSchema<typeof TimetableSchema>> {
    constructor() {
        super('Timetable', TimetableSchema);
    }
}
