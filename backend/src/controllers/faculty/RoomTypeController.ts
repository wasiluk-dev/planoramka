import { HydratedDocumentFromSchema } from 'mongoose';

import RoomType from '../../models/faculty/RoomType';
import BaseController from '../BaseController';

const base = new RoomType();
class RoomTypeController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default RoomTypeController;
