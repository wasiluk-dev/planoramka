import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Semester from '../courses/Semester';
import Class from './Class';

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
    classes: [{
        type: Schema.Types.ObjectId,
        ref: new Class().name,
    }],
});

class Timetable extends Base<HydratedDocumentFromSchema<typeof TimetableSchema>> {
    constructor() {
        super('Timetable', TimetableSchema);
    }
}

export default Timetable;
