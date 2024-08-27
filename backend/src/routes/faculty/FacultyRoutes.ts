import { HydratedDocumentFromSchema } from 'mongoose';

import FacultyController from '../../controllers/faculty/FacultyController';
import BaseRoutes from '../BaseRoutes';

const controller = new FacultyController();
class FacultyRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'faculties', 'faculty');
    }
}

export default FacultyRoutes;
