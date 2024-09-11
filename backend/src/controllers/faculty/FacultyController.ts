import { HydratedDocumentFromSchema } from 'mongoose';

import Faculty, { FacultySchema } from '../../models/faculty/Faculty';
import BaseController from '../BaseController';

const base = new Faculty();
class FacultyController extends BaseController<HydratedDocumentFromSchema<typeof FacultySchema>> {
    constructor() {
        super(base);
    }
}

export default FacultyController;
