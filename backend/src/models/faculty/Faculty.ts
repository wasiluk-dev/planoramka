import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Course from '../courses/Course';
import Building from './Building';

// WI | Wydział Informatyki | [Informatyka, Informatyka i ekonometria] | [Budynek A, Budynek B, Budynek C]
export const FacultyDefinition = {
    name: {
        type: String,
        required: true,
    },
    acronym: {
        type: String,
    },
    buildings: [{
        type: Schema.Types.ObjectId,
        ref: new Building().name,
        autopopulate: {
            select: '-address',
        },
    }],
    courses: [{
        type: Schema.Types.ObjectId,
        ref: new Course().name,
    }],
} as const;
export const FacultySchema = new Schema(FacultyDefinition);

export default class Faculty extends Base<HydratedDocumentFromSchema<typeof FacultySchema>> {
    constructor() {
        super('Faculty', FacultySchema);
    }
}
