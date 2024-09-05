import { HydratedDocumentFromSchema } from 'mongoose';

import RoomTypeController from '../../controllers/faculty/RoomTypeController';
import BaseRoutes from '../BaseRoutes';

const controller = new RoomTypeController();
class RoomTypeRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'room-types', 'roomType');
    }
}

export default RoomTypeRoutes;
