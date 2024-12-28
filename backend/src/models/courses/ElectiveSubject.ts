import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Subject from './Subject';

export const ElectiveSubjectSchema = new Schema({
    name: {
        type: String,
    },
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
    }],
});

ElectiveSubjectSchema.path('name').required(true, 'db_electiveSubject_name_required');
ElectiveSubjectSchema.path('subjects').default([]);

export default class ElectiveSubject extends Base<HydratedDocumentFromSchema<typeof ElectiveSubjectSchema>> {
    constructor() {
        super('ElectiveSubject', ElectiveSubjectSchema);
    }
}
