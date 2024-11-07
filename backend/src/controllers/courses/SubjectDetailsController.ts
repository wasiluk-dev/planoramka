import { HydratedDocumentFromSchema } from 'mongoose';

import SubjectDetails, { SubjectDetailsSchema } from '../../models/courses/SubjectDetails';
import BaseController from '../BaseController';

const base = new SubjectDetails();
class SubjectDetailsController extends BaseController<HydratedDocumentFromSchema<typeof SubjectDetailsSchema>> {
    constructor() {
        super(base);
    }
}

export default SubjectDetailsController;
