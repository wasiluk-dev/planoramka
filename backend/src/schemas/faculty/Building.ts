import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import { RoomSchema } from './Room';

// <Wydział Informatyki> | A | Budynek A | Wiejska 45A, 15-XXX Białystok, Polska | true | true | [101, 102, 103...]
// <Wydział Informatyki> | B | Budynek B | Wiejska 45B, 15-XXX Białystok, Polska | (false) | (false) | [B01, B02, B03...]
// <Wydział Informatyki> | C | Budynek C | Wiejska 45C, 15-XXX Białystok, Polska | (false) | (false) | [001, 002, 003...]
export const BuildingSchema = new Schema({
    acronym: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    hasDeanOffice: {
        type: Boolean,
        default: false,
    },
    hasRectorOffice: {
        type: Boolean,
        default: false,
    },
    rooms: {
        type: [RoomSchema],
    },
});

class Building extends Base<HydratedDocumentFromSchema<typeof BuildingSchema>> {
    constructor() {
        super('Building', BuildingSchema);
    }
}

export default Building;
