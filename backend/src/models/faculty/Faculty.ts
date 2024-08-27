import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import { BuildingSchema } from './Building';

// WI | Wydział Informatyki | [Budynek A, Budynek B, Budynek C]
export const FacultySchema = new Schema({
    acronym: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    buildings: {
        type: [BuildingSchema],
    },
});

class Faculty extends Base<HydratedDocumentFromSchema<typeof FacultySchema>> {
    constructor() {
        super('Faculty', FacultySchema);
    }
}

export default Faculty;
