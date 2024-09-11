import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import { SubjectSchema } from '../courses/Subject';
import { SubjectTypeSchema } from '../courses/SubjectType';
import { RoomSchema } from '../faculty/Room';
import { PeriodSchema } from './Period';

export const ClassSchema = new Schema({
    subject: {
        type: SubjectSchema,
    },
    subjectType: {
        type: SubjectTypeSchema,
    },
    room: {
        type: RoomSchema,
        required: true,
    },
    periods: [{
        type: PeriodSchema,
        required: true,
    }],
});

class Class extends Base<HydratedDocumentFromSchema<typeof ClassSchema>> {
    constructor() {
        super('Class', ClassSchema);
    }
}

export default Class;
