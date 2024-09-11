import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Class from './Class';

export const TimetableSchema = new Schema({
    classes: {
        type: Schema.Types.ObjectId,
        ref: new Class().name,
    },
});

class Timetable extends Base<HydratedDocumentFromSchema<typeof TimetableSchema>> {
    constructor() {
        super('Timetable', TimetableSchema);
    }
}

export default Timetable;
