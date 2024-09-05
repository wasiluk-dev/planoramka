import { HydratedDocumentFromSchema } from 'mongoose';

import Faculty from '../../models/faculty/Faculty';
import BaseController from '../BaseController';

const base = new Faculty();
class FacultyController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default FacultyController;
