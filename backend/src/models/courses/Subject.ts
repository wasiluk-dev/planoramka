import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import ClassType from '../timetable/ClassType';

// INF1PPR | BSK | Bezpieczeństwo sieci komputerowych | [Wykład, Ćwiczenia]
// INZ1PEI | PEiE | Podstawy elektroniki i elektrotechniki | [Wykład, Laboratorium]
export const SubjectSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
    },
    isElective: {
        type: Boolean,
        default: false,
    },
    targetedSemesters: {
        type: [Number],
        min: 1,
        validate: {
            validator: Number.isInteger,
        },
    },
    types: [{
        type: Schema.Types.ObjectId,
        ref: new ClassType().name,
    }],
});

class Subject extends Base<HydratedDocumentFromSchema<typeof SubjectSchema>> {
    constructor() {
        super('Subject', SubjectSchema);
    }
}

export default Subject;
