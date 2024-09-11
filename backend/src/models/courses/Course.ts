import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import ECourseCycle from '../../enums/ECourseCycle';
import ECourseDegree from '../../enums/ECourseDegree';
import ECourseMode from '../../enums/ECourseMode';
import Base from '../Base';
import Semester from './Semester';

// INF1 | Informatyka | I stopnia | inżynierskie | stacjonarne | 2021 | (9)
export const CourseSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
    },
    cycle: {
        type: Number,
        enum: ECourseCycle,
        required: true,
    },
    degree: {
        type: Number,
        enum: ECourseDegree,
    },
    mode: {
        type: Number,
        enum: ECourseMode,
        required: true,
    },
    startDate: {
        type: Date,
    },
    semesterCount: {
        type: Number,
        required: true,
    },
    semesters: {
        type: [Schema.Types.ObjectId],
        ref: new Semester().name,
    },
});

class Course extends Base<HydratedDocumentFromSchema<typeof CourseSchema>> {
    constructor() {
        super('Course', CourseSchema);
    }
}

export default Course;
