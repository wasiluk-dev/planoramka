import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import EDayOfTheWeek from '../../enums/EDayOfTheWeek';

function orderValidator(order: number) {
    return Number.isInteger(order) && order >= 1;
}

export const PeriodSchema = new Schema({
    weekdays: [{
        type: Number,
        enum: EDayOfTheWeek,
    }],
    order: {
        type: Number,
        validate: {
            validator: orderValidator,
            message: 'db_period_order_invalid',
        },
    },
    startTime: {
        type: String,
        validate: /[0-9]{2}:[0-9]{2}/,
    },
    endTime: {
        type: String,
        validate: /[0-9]{2}:[0-9]{2}/,
    },
});

PeriodSchema.path('weekdays').required(true, 'db_period_weekdays_required');
PeriodSchema.path('order').required(true, 'db_period_order_required');
PeriodSchema.path('startTime').required(true, 'db_period_startTime_required');
PeriodSchema.path('endTime').required(true, 'db_period_endTime_required');

export default class Period extends Base<HydratedDocumentFromSchema<typeof PeriodSchema>> {
    constructor() {
        super('Period', PeriodSchema);
    }
}
