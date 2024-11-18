import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';

// A030 | <Sala wykładowa> | 60
export const RoomDefinition = {
    number: {
        type: String,
        // TODO: uncomment required: true,
    },
    numberSecondary: {
        type: String,
    },
    capacity: {
        type: Number,
    },
} as const;
export const RoomSchema = new Schema(RoomDefinition);

RoomSchema.virtual('roomNumber')
    .get(function() {
        if (!this.number && !this.numberSecondary) {
            return null;
        }

        if (!this.numberSecondary) {
            return this.number;
        } else if (!this.number) {
            return this.numberSecondary;
        } else {
            return `${this.number} (${this.numberSecondary})`;
        }
    });

export default class Room extends Base<HydratedDocumentFromSchema<typeof RoomSchema>> {
    constructor() {
        super('Room', RoomSchema);
    }
}
