import { HydratedDocumentFromSchema } from 'mongoose';

import CourseController from '../../controllers/courses/CourseController';
import BaseRoutes from '../BaseRoutes';

const controller = new CourseController();
class CourseRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'courses', 'course');
    }
}

export default CourseRoutes;
