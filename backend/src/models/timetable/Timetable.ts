import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Semester from '../courses/Semester';
import Class from './Class';
import Schedule from './Schedule';

export const TimetableSchema = new Schema({
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
    classes: [{
        type: Schema.Types.ObjectId,
        ref: new Class().name,
        autopopulate: true,
    }],
});

class Timetable extends Base<HydratedDocumentFromSchema<typeof TimetableSchema>> {
    constructor() {
        super('Timetable', TimetableSchema);
    }
}

export default Timetable;
