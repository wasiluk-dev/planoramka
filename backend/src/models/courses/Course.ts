import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import ECourseCycle from '../../enums/ECourseCycle';
import ECourseDegree from '../../enums/ECourseDegree';
import ECourseMode from '../../enums/ECourseMode';
import Base from '../Base';
import Semester from './Semester';
import ElectiveSubject from './ElectiveSubject';

export const CourseSchema = new Schema({
    code: {
        type: String,
    },
    name: {
        type: String,
    },
    specialization: {
        type: String,
    },
    degree: {
        type: Number,
        enum: ECourseDegree,
    },
    cycle: {
        type: Number,
        enum: ECourseCycle,
    },
    mode: {
        type: Number,
        enum: ECourseMode,
    },
    semesters: [{
        type: Schema.Types.ObjectId,
        ref: new Semester().name,
        autopopulate: true,
    }],
    electiveSubjects: [{
        type: Schema.Types.ObjectId,
        ref: new ElectiveSubject().name,
    }],
});

CourseSchema.path('code').required(true, 'db_course_code_required');
CourseSchema.path('name').required(true, 'db_course_name_required');
CourseSchema.path('specialization').default(null);
// TODO: decide if the field should be required
CourseSchema.path('degree').default(null); // .required(true, 'db_course_degree_required');
CourseSchema.path('cycle').required(true, 'db_course_cycle_required');
CourseSchema.path('mode').required(true, 'db_course_mode_required');
CourseSchema.path('semesters').default([]);
CourseSchema.path('electiveSubjects').default([]);

export default class Course extends Base<HydratedDocumentFromSchema<typeof CourseSchema>> {
    constructor() {
        super('Course', CourseSchema);
    }
}
