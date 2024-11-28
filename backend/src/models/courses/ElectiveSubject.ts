import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Subject from './Subject';

// Język obcy | [Angielski, Niemiecki, Rosyjski]
// Programowanie aplikacji WWW | [.NET, Java, Szkieletowe]
export const ElectiveSubjectDefinition = {
    name: {
        type: String,
        required: true,
    },
    subjects: {
        type: [Schema.Types.ObjectId],
        ref: new Subject().name,
        default: [],
    },
} as const;
export const ElectiveSubjectSchema = new Schema(ElectiveSubjectDefinition);

export default class ElectiveSubject extends Base<HydratedDocumentFromSchema<typeof ElectiveSubjectSchema>> {
    constructor() {
        super('ElectiveSubject', ElectiveSubjectSchema);
    }
}
