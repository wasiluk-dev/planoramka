import { HydratedDocumentFromSchema } from 'mongoose';

import CourseController from '../../controllers/courses/CourseController';
import { CourseSchema } from '../../models/courses/Course';
import BaseRoutes from '../BaseRoutes';

const controller = new CourseController();
export default class CourseRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof CourseSchema>> {
    constructor() {
        super(controller, 'courses', 'course');
    }
}
