import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Subject from './Subject';

export const SemesterDefinition = {
    academicYear: {
        type: String,
        // match: '^[0-9][0-9][0-9][0-9]\/[0-9][0-9][0-9][0-9]$', TODO: fix the regexp
        required: true,
    },
    index: {
        type: Number,
        min: 1,
        validate: {
            validator: Number.isInteger,
        },
        required: true,
    },
    subjects: {
        type: [Schema.Types.ObjectId],
        ref: new Subject().name,
        autopopulate: {
            select: '_id classTypes',
        },
        default: [],
    },
} as const;
export const SemesterSchema = new Schema(SemesterDefinition);

export default class Semester extends Base<HydratedDocumentFromSchema<typeof SemesterSchema>> {
    constructor() {
        super('Semester', SemesterSchema);
    }
}
