import { HydratedDocumentFromSchema } from 'mongoose';

import Room from '../../models/faculty/Room';
import BaseController from '../BaseController';

const base = new Room();
class RoomController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default RoomController;
