import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Period from './Period';
import EDayOfTheWeek from '../../enums/EDayOfTheWeek';

// [0, 1, 2, 3, 4] | [08:30, 09:15]
// [0, 1, 2, 3, 4] | 09:15 | 09:30
// [0, 1, 2, 3, 4] | 09:30 | 10:15
// [5, 6] | 08:00 | 08:45
export const ScheduleDefinition = {
    // Date.getDay() compatible
    weekdays: [{
        type: Number,
        enum: EDayOfTheWeek,
        required: true,
    }],
    periods: {
        type: [Schema.Types.ObjectId],
        ref: new Period().name,
        autopopulate: {
            select: '-_id -weekdays',
        },
        default: [],
    },
} as const;
export const ScheduleSchema = new Schema(ScheduleDefinition);

export default class Schedule extends Base<HydratedDocumentFromSchema<typeof ScheduleSchema>> {
    constructor() {
        super('Schedule', ScheduleSchema);
    }
}
