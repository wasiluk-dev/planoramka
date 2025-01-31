import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Course from '../courses/Course';
import Building from './Building';

export const FacultySchema = new Schema({
    name: {
        type: String,
    },
    acronym: {
        type: String,
    },
    buildings: [{
        type: Schema.Types.ObjectId,
        ref: new Building().name,
        autopopulate: {
            select: '-address',
        },
    }],
    courses: [{
        type: Schema.Types.ObjectId,
        ref: new Course().name,
        autopopulate: {
            select: '_id code name specialization semesters',
            maxDepth: 4,
        },
    }],
});

FacultySchema.path('name').required(true, 'db_faculty_name_required');
FacultySchema.path('acronym').required(true, 'db_faculty_acronym_required');
FacultySchema.path('buildings').default([]);
FacultySchema.path('courses').default([]);

export default class Faculty extends Base<HydratedDocumentFromSchema<typeof FacultySchema>> {
    constructor() {
        super('Faculty', FacultySchema);
    }
}
