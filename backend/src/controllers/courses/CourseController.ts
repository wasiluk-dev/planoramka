import { HydratedDocumentFromSchema } from 'mongoose';

import Course, { CourseSchema } from '../../models/courses/Course';
import BaseController from '../BaseController';

const base = new Course();
class CourseController extends BaseController<HydratedDocumentFromSchema<typeof CourseSchema>> {
    constructor() {
        super(base);
    }
}

export default CourseController;
