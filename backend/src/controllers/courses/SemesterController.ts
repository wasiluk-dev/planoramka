import { HydratedDocumentFromSchema } from 'mongoose';

import Semester from '../../models/courses/Semester';
import BaseController from '../BaseController';

const base = new Semester();
class SemesterController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default SemesterController;
