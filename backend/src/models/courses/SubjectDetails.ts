import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import ClassType from '../timetable/ClassType';
import Course from './Course';
import Subject from './Subject';

export const SubjectDetailsDefinition = {
    course: {
        type: Schema.Types.ObjectId,
        ref: new Course().name,
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
    },
    details: [{
        _id: false,
        classType: {
            type: Schema.Types.ObjectId,
            ref: new ClassType().name,
        },
        weeklyBlockCount: {
            type: Number,
            min: 0,
            validate: {
                validator: Number.isInteger,
            },
        },
    }],
} as const;

export const SubjectDetailsSchema = new Schema(SubjectDetailsDefinition);

class SubjectDetails extends Base<HydratedDocumentFromSchema<typeof SubjectDetailsSchema>> {
    constructor() {
        super('SubjectDetails', SubjectDetailsSchema);
    }
}

export default SubjectDetails;
