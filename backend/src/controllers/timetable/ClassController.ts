import { HydratedDocumentFromSchema } from 'mongoose';

import Class, { ClassSchema } from '../../models/timetable/Class';
import BaseController from '../BaseController';

const base = new Class();
class ClassController extends BaseController<HydratedDocumentFromSchema<typeof ClassSchema>> {
    constructor() {
        super(base);
    }
}

export default ClassController;
