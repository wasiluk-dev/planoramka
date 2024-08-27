import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';

// I stopnia | licencjackie
// I stopnia | inżynierskie
// II stopnia | magisterskie
// jednolite | magisterskie
// III stopnia | doktoranckie
export const CourseTypeSchema = new Schema({
    cycle: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
});

class CourseType extends Base<HydratedDocumentFromSchema<typeof CourseTypeSchema>> {
    constructor() {
        super('CourseType', CourseTypeSchema);
    }
}

export default CourseType;
