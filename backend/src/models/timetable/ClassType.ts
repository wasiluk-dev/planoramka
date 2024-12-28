import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';

export const ClassTypeSchema = new Schema({
    name: {
        type: String,
    },
    acronym: {
        type: String,
    },
    // TODO: add a validation error message
    color: {
        type: String,
        validation: /#[0-9A-Fa-f]{6}/,
    },
});

ClassTypeSchema.path('name').required(true, 'db_classType_name_required');
ClassTypeSchema.path('acronym').required(true, 'db_classType_acronym_required');
ClassTypeSchema.path('color').default(null);

export default class ClassType extends Base<HydratedDocumentFromSchema<typeof ClassTypeSchema>> {
    constructor() {
        super('ClassType', ClassTypeSchema);
    }
}
