import { HydratedDocumentFromSchema } from 'mongoose';

import RoomController from '../../controllers/faculty/RoomController';
import BaseRoutes from '../BaseRoutes';

const controller = new RoomController();
class RoomRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'rooms', 'room');
    }
}

export default RoomRoutes;
