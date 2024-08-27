import { HydratedDocumentFromSchema } from 'mongoose';

import SubjectController from '../../controllers/courses/SubjectController';
import BaseRoutes from '../BaseRoutes';

const controller = new SubjectController();
class SubjectRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'subjects', 'subject');
    }
}

export default SubjectRoutes;
