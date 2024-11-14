import { HydratedDocumentFromSchema } from 'mongoose';

import RoomController from '../../controllers/faculty/RoomController';
import { RoomSchema } from '../../models/faculty/Room';
import BaseRoutes from '../BaseRoutes';

const controller = new RoomController();
export default class RoomRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof RoomSchema>> {
    constructor() {
        super(controller, 'rooms', 'room');
    }
}
