import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Subject from './Subject';

export const SemesterDefinition = {
    academicYear: {
        type: String,
        // match: '^[0-9][0-9][0-9][0-9]\/[0-9][0-9][0-9][0-9]$', TODO: fix the regexp
    },
    index: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
        },
    },
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
        autopopulate: true,
    }],
} as const;
export const SemesterSchema = new Schema(SemesterDefinition);

export default class Semester extends Base<HydratedDocumentFromSchema<typeof SemesterSchema>> {
    constructor() {
        super('Semester', SemesterSchema);
    }
}
