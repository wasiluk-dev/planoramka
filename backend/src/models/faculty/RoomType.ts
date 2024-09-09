import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';

// Sala wykładowa | #00FF00
export const RoomTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        validation: /#[0-9A-Fa-f]{6}/,
    },
})

class RoomType extends Base<HydratedDocumentFromSchema<typeof RoomTypeSchema>> {
    constructor() {
        super('RoomType', RoomTypeSchema);
    }
}

export default RoomType;