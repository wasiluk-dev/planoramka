import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Period from './Period';
import EDayOfTheWeek from '../../enums/EDayOfTheWeek';

export const ScheduleSchema = new Schema({
    weekdays: [{
        type: Number,
        enum: EDayOfTheWeek,
    }],
    periods: [{
        type: Schema.Types.ObjectId,
        ref: new Period().name,
        autopopulate: {
            select: '-_id -weekdays',
        },
    }],
    active: {
        type: Boolean,
    },
});

ScheduleSchema.path('weekdays').required(true, 'db_schedule_weekdays_required');
ScheduleSchema.path('periods').default([]);
ScheduleSchema.path('active').default(false);

export default class Schedule extends Base<HydratedDocumentFromSchema<typeof ScheduleSchema>> {
    constructor() {
        super('Schedule', ScheduleSchema);
    }
}
