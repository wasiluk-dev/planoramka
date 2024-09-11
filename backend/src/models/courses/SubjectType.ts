import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';

// W | Wykład | (#00FF00)
// Lab | Laboratorium | (#FF0000)
// Sem | Seminarium | (#0000FF)
export const SubjectTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    acronym: {
        type: String,
    },
    color: {
        type: String,
        validation: /#[0-9A-Fa-f]{6}/,
    },
});

class SubjectType extends Base<HydratedDocumentFromSchema<typeof SubjectTypeSchema>> {
    constructor() {
        super('SubjectType', SubjectTypeSchema);
    }
}

export default SubjectType;
