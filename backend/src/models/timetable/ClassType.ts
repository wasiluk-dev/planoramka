import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';

// W | Wykład | (#00FF00)
// Lab | Laboratorium | (#FF0000)
// Sem | Seminarium | (#0000FF)
export const ClassTypeSchema = new Schema({
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

class ClassType extends Base<HydratedDocumentFromSchema<typeof ClassTypeSchema>> {
    constructor() {
        super('ClassType', ClassTypeSchema);
    }
}

export default ClassType;
