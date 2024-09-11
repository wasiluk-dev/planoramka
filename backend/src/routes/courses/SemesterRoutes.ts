import { HydratedDocumentFromSchema } from 'mongoose';

import SemesterController from '../../controllers/courses/SemesterController';
import { SemesterSchema } from '../../models/courses/Semester';
import BaseRoutes from '../BaseRoutes';

const controller = new SemesterController();
class SemesterRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof SemesterSchema>> {
    constructor() {
        super(controller, 'semesters', 'semester');
    }
}

export default SemesterRoutes;
