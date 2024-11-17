import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Course from '../courses/Course';
import Building from './Building';

// WI | Wydział Informatyki | [Informatyka, Informatyka i ekonometria] | [Budynek A, Budynek B, Budynek C]
export const FacultyDefinition = {
    acronym: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    courses: {
        type: Schema.Types.ObjectId,
        ref: new Course().name,
    },
    buildings: [{
        type: Schema.Types.ObjectId,
        ref: new Building().name,
        autopopulate: {
            select: '-address',
        },
    }],
} as const;
export const FacultySchema = new Schema(FacultyDefinition);

export default class Faculty extends Base<HydratedDocumentFromSchema<typeof FacultySchema>> {
    constructor() {
        super('Faculty', FacultySchema);
    }
}
