import { HydratedDocumentFromSchema, Schema } from 'mongoose';

import Base from '../Base';
import Room from './Room';

export const BuildingSchema = new Schema({
    name: {
        type: String,
    },
    acronym: {
        type: String,
    },
    address: {
        type: String,
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
});

BuildingSchema.path('name').required(true, 'db_building_name_required');
BuildingSchema.path('acronym').default(null);
BuildingSchema.path('address').default(null);
BuildingSchema.path('rooms').default([]);

export default class Building extends Base<HydratedDocumentFromSchema<typeof BuildingSchema>> {
    constructor() {
        super('Building', BuildingSchema);
    }
}
