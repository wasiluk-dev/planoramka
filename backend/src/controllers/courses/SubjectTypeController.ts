import { HydratedDocumentFromSchema } from 'mongoose';

import SubjectType from '../../models/courses/SubjectType';
import BaseController from '../BaseController';

const base = new SubjectType();
class SubjectTypeController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default SubjectTypeController;
