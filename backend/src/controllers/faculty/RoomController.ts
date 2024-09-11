import { HydratedDocumentFromSchema } from 'mongoose';

import Room, { RoomSchema } from '../../models/faculty/Room';
import BaseController from '../BaseController';

const base = new Room();
class RoomController extends BaseController<HydratedDocumentFromSchema<typeof RoomSchema>> {
    constructor() {
        super(base);
    }
}

export default RoomController;
