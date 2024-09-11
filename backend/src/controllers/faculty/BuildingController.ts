import { HydratedDocumentFromSchema } from 'mongoose';

import Building, { BuildingSchema } from '../../models/faculty/Building';
import BaseController from '../BaseController';

const base = new Building();
class BuildingController extends BaseController<HydratedDocumentFromSchema<typeof BuildingSchema>> {
    constructor() {
        super(base);
    }
}

export default BuildingController;
