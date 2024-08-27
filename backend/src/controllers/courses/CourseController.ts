import { HydratedDocumentFromSchema } from 'mongoose';

import Course from '../../models/courses/Course';
import BaseController from '../BaseController';

const base = new Course();
class CourseController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default CourseController;
