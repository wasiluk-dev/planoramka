import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import { SubjectSchema } from './Subject';

export const SemesterSchema = new Schema({
    subjects: [SubjectSchema],
});

class Semester extends Base<HydratedDocumentFromSchema<typeof SemesterSchema>> {
    constructor() {
        super('Semester', SemesterSchema);
    }
}

export default Semester;
