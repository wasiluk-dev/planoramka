import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Room from './Room';

// A | Budynek A | Wiejska 45A, 15-351 Białystok, Polska | true | true | [101, 102, 103...]
// B | Budynek B | Wiejska 45A, 15-351 Białystok, Polska | (false) | (false) | [B01, B02, B03...]
// C | Budynek C | Wiejska 45A, 15-351 Białystok, Polska | (false) | (false) | [001, 002, 003...]
export const BuildingDefinition = {
    name: {
        type: String,
        required: true,
    },
    acronym: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    // hasDeanOffice: {
    //     type: Boolean,
    //     default: false,
    // },
    // hasRectorOffice: {
    //     type: Boolean,
    //     default: false,
    // },
    rooms: [{
        type: Schema.Types.ObjectId,
        ref: new Room().name,
        autopopulate: true,
    }],
} as const;
export const BuildingSchema = new Schema(BuildingDefinition);

export default class Building extends Base<HydratedDocumentFromSchema<typeof BuildingSchema>> {
    constructor() {
        super('Building', BuildingSchema);
    }
}
