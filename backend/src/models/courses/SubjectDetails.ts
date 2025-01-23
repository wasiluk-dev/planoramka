import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import ClassType from '../timetable/ClassType';
import Course from './Course';
import Subject from './Subject';

function weeklyBlockCountValidator(weeklyBlockCount: number) {
    return Number.isInteger(weeklyBlockCount) && weeklyBlockCount >= 0;
}

export const SubjectDetailsSchema = new Schema({
    subject: {
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
        autopopulate: {
            select: '-classTypes',
        },
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: new Course().name,
        autopopulate: {
            select: '_id code name specialization',
        }
    },
    details: {
        _id: false,
        type: [{
            classType: {
                type: Schema.Types.ObjectId,
                ref: new ClassType().name,
                autopopulate: true,
            },
            weeklyBlockCount: {
                type: Number,
                validate: {
                    validator: weeklyBlockCountValidator,
                    message: 'db_subjectDetails_details_weeklyBlockCount_invalid',
                },
            },
        }],
    },
});

SubjectDetailsSchema.path('subject').required(true, 'db_subjectDetails_subject_required');
SubjectDetailsSchema.path('course').required(true, 'db_subjectDetails_course_required');
SubjectDetailsSchema.path('details').default([]);
SubjectDetailsSchema.path('details.classType').required(true, 'db_subjectDetails_details_classType_required');
SubjectDetailsSchema.path('details.weeklyBlockCount').required(true, 'db_subjectDetails_details_weeklyBlockCount_required');

export default class SubjectDetails extends Base<HydratedDocumentFromSchema<typeof SubjectDetailsSchema>> {
    constructor() {
        super('SubjectDetails', SubjectDetailsSchema);
    }
}
