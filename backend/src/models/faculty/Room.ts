import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';

export const RoomSchema = new Schema({
    number: {
        type: String,
    },
    numberSecondary: {
        type: String,
    },
    capacity: {
        type: Number,
    },
});

RoomSchema.path('number').required(true, 'db_room_number_required');
RoomSchema.path('numberSecondary').default(null);
RoomSchema.path('capacity').default(null);
RoomSchema.virtual('roomNumber')
    .get(function(): string {
        if (!this.numberSecondary) {
            return this.number!;
        } else if (!this.number) {
            return this.numberSecondary;
        } else {
            return `${ this.number } (${ this.numberSecondary })`;
        }
    });

export default class Room extends Base<HydratedDocumentFromSchema<typeof RoomSchema>> {
    constructor() {
        super('Room', RoomSchema);
    }
}
