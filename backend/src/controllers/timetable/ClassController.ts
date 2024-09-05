import { HydratedDocumentFromSchema } from 'mongoose';

import Class from '../../models/timetable/Class';
import BaseController from '../BaseController';

const base = new Class();
class ClassController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default ClassController;
