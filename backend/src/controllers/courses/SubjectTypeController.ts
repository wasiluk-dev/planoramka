import { HydratedDocumentFromSchema } from 'mongoose';

import SubjectType, { SubjectTypeSchema } from '../../models/courses/SubjectType';
import BaseController from '../BaseController';

const base = new SubjectType();
class SubjectTypeController extends BaseController<HydratedDocumentFromSchema<typeof SubjectTypeSchema>> {
    constructor() {
        super(base);
    }
}

export default SubjectTypeController;
