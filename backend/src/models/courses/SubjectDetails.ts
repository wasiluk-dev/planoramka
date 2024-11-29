import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import ClassType from '../timetable/ClassType';
import Course from './Course';
import Subject from './Subject';

export const SubjectDetailsDefinition = {
    course: {
        type: Schema.Types.ObjectId,
        ref: new Course().name,
        required: true,
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
        autopopulate: {
            select: '-classTypes',
        },
        required: true,
    },
    details: {
        _id: false,
        type: [{
            classType: {
                type: Schema.Types.ObjectId,
                ref: new ClassType().name,
                autopopulate: {
                    select: '-_id',
                },
                required: true,
            },
            weeklyBlockCount: {
                type: Number,
                min: 0,
                validate: {
                    validator: Number.isInteger,
                },
                required: true,
            },
        }],
        default: [],
    },
} as const;
export const SubjectDetailsSchema = new Schema(SubjectDetailsDefinition);

export default class SubjectDetails extends Base<HydratedDocumentFromSchema<typeof SubjectDetailsSchema>> {
    constructor() {
        super('SubjectDetails', SubjectDetailsSchema);
    }
}
