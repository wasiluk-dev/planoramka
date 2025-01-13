import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Subject from './Subject';

function indexValidator(index: number) {
    return Number.isInteger(index) && index >= 1;
}

export const SemesterSchema = new Schema({
    academicYear: {
        type: String,
        // match: '^[0-9][0-9][0-9][0-9]\/[0-9][0-9][0-9][0-9]$', TODO: fix the regexp
    },
    academicYearIndex: {
        type: Number,
    },
    index: {
        type: Number,
        validate: {
            validator: indexValidator,
            message: 'db_semester_index_invalid',
        },
    },
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
        autopopulate: {
            select: '_id classTypes',
        },
    }],
});

SemesterSchema.path('academicYear').required(true, 'db_semester_academicYear_required')
// SemesterSchema.path('academicYearIndex').required(true, 'db_semester_academicYearIndex_required')
SemesterSchema.path('index').required(true, 'db_semester_index_required')
SemesterSchema.path('subjects').default([]);

export default class Semester extends Base<HydratedDocumentFromSchema<typeof SemesterSchema>> {
    constructor() {
        super('Semester', SemesterSchema);
    }
}
