import { HydratedDocumentFromSchema } from 'mongoose';

import BuildingController from '../../controllers/faculty/BuildingController';
import { BuildingSchema } from '../../models/faculty/Building';
import BaseRoutes from '../BaseRoutes';

const controller = new BuildingController();
class BuildingRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof BuildingSchema>> {
    constructor() {
        super(controller, 'buildings', 'building');
    }
}

export default BuildingRoutes;
