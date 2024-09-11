import { HydratedDocumentFromSchema } from 'mongoose';

import Subject, { SubjectSchema } from '../../models/courses/Subject';
import BaseController from '../BaseController';

const base = new Subject();
class SubjectController extends BaseController<HydratedDocumentFromSchema<typeof SubjectSchema>> {
    constructor() {
        super(base);
    }
}

export default SubjectController;
