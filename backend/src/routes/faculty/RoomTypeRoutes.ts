import { HydratedDocumentFromSchema } from 'mongoose';

import RoomTypeController from '../../controllers/faculty/RoomTypeController';
import { RoomTypeSchema } from '../../models/faculty/RoomType';
import BaseRoutes from '../BaseRoutes';

const controller = new RoomTypeController();
export default class RoomTypeRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof RoomTypeSchema>> {
    constructor() {
        super(controller, 'room-types', 'roomType');
    }
}
