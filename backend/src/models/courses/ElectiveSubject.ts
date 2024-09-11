import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Subject from './Subject';

// Język obcy | [Angielski, Niemiecki, Rosyjski]
// Programowanie aplikacji WWW | [.NET, Java, Szkieletowe]
export const ElectiveSubjectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    courseCode: {
        type: String,
        required: true,
    },
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
    }],
});

class ElectiveSubject extends Base<HydratedDocumentFromSchema<typeof ElectiveSubjectSchema>> {
    constructor() {
        super('ElectiveSubject', ElectiveSubjectSchema);
    }
}

export default ElectiveSubject;
