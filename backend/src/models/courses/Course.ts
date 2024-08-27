import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import EMonth from '../../enums/EMonth';
import Base from '../Base';
import { CourseTypeSchema } from './CourseType';
import { SemesterSchema } from './Semester';

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
    type: CourseTypeSchema,
    startYear: {
        type: String,
        validate: /[0-9]{4}/,
        required: true,
    },
    startMonth: {
        type: Number,
        enum: EMonth,
        required: true,
    },
    semesterCount: {
        type: Number,
        required: true,
    },
    semesters: {
        type: [SemesterSchema],
    },
})

class Course extends Base<HydratedDocumentFromSchema<typeof CourseSchema>> {
    constructor() {
        super('Course', CourseSchema);
    }
}

export default Course;
