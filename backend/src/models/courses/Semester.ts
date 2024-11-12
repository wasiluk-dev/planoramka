import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import ElectiveSubject from './ElectiveSubject';
import Subject from './Subject';

export const SemesterDefinition = {
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: new Subject().name,
    }],
    electiveSubjects: [{
        type: Schema.Types.ObjectId,
        ref: new ElectiveSubject().name,
    }],
} as const;
export const SemesterSchema = new Schema(SemesterDefinition);

class Semester extends Base<HydratedDocumentFromSchema<typeof SemesterSchema>> {
    constructor() {
        super('Semester', SemesterSchema);
    }
}

export default Semester;
