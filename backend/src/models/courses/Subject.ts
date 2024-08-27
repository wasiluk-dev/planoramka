import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import { SubjectTypeSchema } from './SubjectType';

// INF1PPR | BSK | Bezpieczeństwo sieci komputerowych | [Wykład, Ćwiczenia]
// INZ1PEI | PEiE | Podstawy elektroniki i elektrotechniki | [Wykład, Laboratorium]
export const SubjectSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    acronym: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    types: {
        type: [SubjectTypeSchema],
        required: true,
    },
});

class Subject extends Base<HydratedDocumentFromSchema<typeof SubjectSchema>> {
    constructor() {
        super('Subject', SubjectSchema);
    }
}

export default Subject;
