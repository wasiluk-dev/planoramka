import { HydratedDocumentFromSchema } from 'mongoose';

import Semester, { SemesterSchema } from '../../models/courses/Semester';
import BaseController from '../BaseController';

const base = new Semester();
class SemesterController extends BaseController<HydratedDocumentFromSchema<typeof SemesterSchema>> {
    constructor() {
        super(base);
    }
}

export default SemesterController;
