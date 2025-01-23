import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Course from '../courses/Course';
import Semester from '../courses/Semester';
import User from '../User';
import EUserRole from '../../enums/EUserRole';

export const PersonalTimetableSchema = new Schema({
    type: {
        type: Number,
        enum: EUserRole,
    },
    professor: {
        type: Schema.Types.ObjectId,
        ref: new User().name,
        autopopulate: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: new Course().name,
        autopopulate: true,
    },
    semester: {
        type: Schema.Types.ObjectId,
        ref: new Semester().name,
        autopopulate: true,
    },
});

PersonalTimetableSchema.path('type').required(true, 'db_timetablePersonal_type_required');
PersonalTimetableSchema.path('professor').default(null);

export default class PersonalTimetable extends Base<HydratedDocumentFromSchema<typeof PersonalTimetableSchema>> {
    constructor() {
        super('PersonalTimetable', PersonalTimetableSchema);
    }
}
