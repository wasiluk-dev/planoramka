import { HydratedDocumentFromSchema } from 'mongoose';

import SubjectTypeController from '../../controllers/courses/SubjectTypeController';
import BaseRoutes from '../BaseRoutes';

const controller = new SubjectTypeController();
class SubjectTypeRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'subject-types', 'subjectType');
    }
}

export default SubjectTypeRoutes;
