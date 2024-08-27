import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import { RoomTypeSchema } from './RoomType';

// A030 | <Sala wykładowa> | 60
export const RoomSchema = new Schema({
    number: {
        type: String,
        required: true,
    },
    type: {
        type: RoomTypeSchema,
    },
    capacity: {
        type: Number,
    },
});

class Room extends Base<HydratedDocumentFromSchema<typeof RoomSchema>> {
    constructor() {
        super('Room', RoomSchema);
    }
}

export default Room;
