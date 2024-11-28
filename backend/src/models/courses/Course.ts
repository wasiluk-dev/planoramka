import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import ECourseCycle from '../../enums/ECourseCycle';
import ECourseDegree from '../../enums/ECourseDegree';
import ECourseMode from '../../enums/ECourseMode';
import Base from '../Base';
import Semester from './Semester';
import ElectiveSubject from './ElectiveSubject';

// INF1 | Informatyka | I stopnia | inżynierskie | stacjonarne | 2021 | (9)
export const CourseDefinition = {
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
    degree: {
        type: Number,
        enum: ECourseDegree,
        // required: true, TODO: decide if required is needed
        default: null,
    },
    cycle: {
        type: Number,
        enum: ECourseCycle,
        required: true,
    },
    mode: {
        type: Number,
        enum: ECourseMode,
        required: true,
    },
    semesters: {
        type: [Schema.Types.ObjectId],
        ref: new Semester().name,
        autopopulate: true,
        default: [],
    },
    electiveSubjects: {
        type: [Schema.Types.ObjectId],
        ref: new ElectiveSubject().name,
        default: [],
    },
} as const;
export const CourseSchema = new Schema(CourseDefinition);

export default class Course extends Base<HydratedDocumentFromSchema<typeof CourseSchema>> {
    constructor() {
        super('Course', CourseSchema);
    }
}
