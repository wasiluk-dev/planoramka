import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import ClassType from '../timetable/ClassType';

function targetedSemestersValidator(targetedSemester: number) {
    return Number.isInteger(targetedSemester) && targetedSemester >= 1;
}

export const SubjectSchema = new Schema({
    code: {
        type: String,
    },
    name: {
        type: String,
    },
    acronym: {
        type: String,
    },
    isElective: {
        type: Boolean,
    },
    targetedSemesters: {
        type: [{
            type: Number,
            validate: {
                validator: targetedSemestersValidator,
                message: 'db_subject_targetedSemesters_invalid',
            },
        }],
    },
    classTypes: [{
        type: Schema.Types.ObjectId,
        ref: new ClassType().name,
        autopopulate: {
            select: '-color',
        },
    }],
});

SubjectSchema.path('code').required(true, 'db_subject_code_required');
SubjectSchema.path('name').required(true, 'db_subject_name_required');
SubjectSchema.path('acronym').default(null);
SubjectSchema.path('isElective').default(false);
SubjectSchema.path('targetedSemesters').default([]);
SubjectSchema.path('classTypes').default([]);

export default class Subject extends Base<HydratedDocumentFromSchema<typeof SubjectSchema>> {
    constructor() {
        super('Subject', SubjectSchema);
    }
}
