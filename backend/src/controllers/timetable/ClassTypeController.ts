import { HydratedDocumentFromSchema } from 'mongoose';

import ClassType, { ClassTypeSchema } from '../../models/timetable/ClassType';
import BaseController from '../BaseController';

const base = new ClassType();
class ClassTypeController extends BaseController<HydratedDocumentFromSchema<typeof ClassTypeSchema>> {
    constructor() {
        super(base);
    }
}

export default ClassTypeController;
