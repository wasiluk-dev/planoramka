import { HydratedDocumentFromSchema } from 'mongoose';

import FacultyController from '../../controllers/faculty/FacultyController';
import { FacultySchema } from '../../models/faculty/Faculty';
import BaseRoutes from '../BaseRoutes';

const controller = new FacultyController();
class FacultyRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof FacultySchema>> {
    constructor() {
        super(controller, 'faculties', 'faculty');
    }
}

export default FacultyRoutes;
