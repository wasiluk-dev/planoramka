import { HydratedDocumentFromSchema } from 'mongoose';

import SubjectTypeController from '../../controllers/courses/SubjectTypeController';
import { SubjectTypeSchema } from '../../models/courses/SubjectType';
import BaseRoutes from '../BaseRoutes';

const controller = new SubjectTypeController();
class SubjectTypeRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof SubjectTypeSchema>> {
    constructor() {
        super(controller, 'subject-types', 'subjectType');
    }
}

export default SubjectTypeRoutes;
