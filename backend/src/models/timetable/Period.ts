import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import EDayOfTheWeek from '../../enums/EDayOfTheWeek';

// 1 | 1 | 08:30 | 09:15
// 2 | 2 | 09:15 | 09:30
// 3 | 3 | 09:30 | 10:15
// 6 | 1 | 08:00 | 08:45
export const PeriodDefinition = {
    weekdays: [{
        type: Number,
        enum: EDayOfTheWeek,
        required: true,
    }],
    order: {
        type: Number,
        min: 1,
        validate: {
            validator: Number.isInteger,
        },
        required: true,
    },
    startTime: {
        type: String,
        validate: /[0-9]{2}:[0-9]{2}/,
        required: true,
    },
    endTime: {
        type: String,
        validate: /[0-9]{2}:[0-9]{2}/,
        required: true,
    },
} as const;
export const PeriodSchema = new Schema(PeriodDefinition);

export default class Period extends Base<HydratedDocumentFromSchema<typeof PeriodSchema>> {
    constructor() {
        super('Period', PeriodSchema);
    }
}
