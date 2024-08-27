import { HydratedDocumentFromSchema } from 'mongoose';

import SemesterController from '../../controllers/courses/SemesterController';
import BaseRoutes from '../BaseRoutes';

const controller = new SemesterController();
class SemesterRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'semesters', 'semester');
    }
}

export default SemesterRoutes;
