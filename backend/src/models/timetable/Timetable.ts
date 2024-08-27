import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import { ClassSchema } from './Class';

const TimetableSchema = new Schema({
    classes: {
        type: [ClassSchema],
        required: true,
    },
});

class Timetable extends Base<HydratedDocumentFromSchema<typeof TimetableSchema>> {
    constructor() {
        super('Timetable', TimetableSchema);
    }
}

export default Timetable;
