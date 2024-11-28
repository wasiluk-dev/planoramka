import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import ClassType from '../timetable/ClassType';

// INF1PPR | BSK | Bezpieczeństwo sieci komputerowych | [Wykład, Ćwiczenia]
// INZ1PEI | PEiE | Podstawy elektroniki i elektrotechniki | [Wykład, Laboratorium]
export const SubjectDefinition = {
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
        default: null,
    },
    isElective: {
        type: Boolean,
        default: false,
    },
    targetedSemesters: {
        type: [{
            type: Number,
            min: 1,
            validate: {
                validator: Number.isInteger,
            },
        }],
        default: [],
    },
    classTypes: {
        type: [Schema.Types.ObjectId],
        ref: new ClassType().name,
        autopopulate: {
            select: '-color',
        },
        default: [],
    },
} as const;
export const SubjectSchema = new Schema(SubjectDefinition);

export default class Subject extends Base<HydratedDocumentFromSchema<typeof SubjectSchema>> {
    constructor() {
        super('Subject', SubjectSchema);
    }
}
