import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import RoomType from './RoomType';

// A030 | <Sala wykładowa> | 60
export const RoomSchema = new Schema({
    number: {
        type: String,
    },
    numberSecondary: {
        type: String,
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: new RoomType().name,
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
