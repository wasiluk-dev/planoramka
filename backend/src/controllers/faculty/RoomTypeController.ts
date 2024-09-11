import { HydratedDocumentFromSchema } from 'mongoose';

import RoomType, { RoomTypeSchema } from '../../models/faculty/RoomType';
import BaseController from '../BaseController';

const base = new RoomType();
class RoomTypeController extends BaseController<HydratedDocumentFromSchema<typeof RoomTypeSchema>> {
    constructor() {
        super(base);
    }
}

export default RoomTypeController;
