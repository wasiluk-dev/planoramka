import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';

// [0, 1, 2, 3, 4] | 08:30 | 09:15 | (false)
// [0, 1, 2, 3, 4] | 09:15 | 09:30 | true
// [0, 1, 2, 3, 4] | 09:30 | 10:15 | (false)
// [5, 6] | 08:00 | 08:45 | (false)
export const PeriodSchema = new Schema({
    weekdays: {
        type: [{
            type: Number,
            min: 0,
            max: 6,
        }],
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
    isBreak: {
        type: Boolean,
        default: false,
    }
});

class Period extends Base<HydratedDocumentFromSchema<typeof PeriodSchema>> {
    constructor() {
        super('Period', PeriodSchema);
    }
}

export default Period;
