import { HydratedDocumentFromSchema } from 'mongoose';

import CourseTypeController from '../../controllers/courses/CourseTypeController';
import BaseRoutes from '../BaseRoutes';

const controller = new CourseTypeController();
class CourseTypeRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'course-types', 'courseType');
    }
}

export default CourseTypeRoutes;
