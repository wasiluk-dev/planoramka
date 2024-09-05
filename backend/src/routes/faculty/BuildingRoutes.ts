import { HydratedDocumentFromSchema } from 'mongoose';

import BuildingController from '../../controllers/faculty/BuildingController';
import BaseRoutes from '../BaseRoutes';

const controller = new BuildingController();
class BuildingRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'buildings', 'building');
    }
}

export default BuildingRoutes;
