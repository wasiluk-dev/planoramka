import { HydratedDocumentFromSchema } from 'mongoose';

import CourseType from '../../models/courses/CourseType';
import BaseController from '../BaseController';

const base = new CourseType();
class CourseTypeController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default CourseTypeController;
