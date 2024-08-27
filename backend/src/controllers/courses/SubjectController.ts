import { HydratedDocumentFromSchema } from 'mongoose';

import Subject from '../../models/courses/Subject';
import BaseController from '../BaseController';

const base = new Subject();
class SubjectController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default SubjectController;
