import { HydratedDocumentFromSchema } from 'mongoose';

import SubjectController from '../../controllers/courses/SubjectController';
import { SubjectSchema } from '../../models/courses/Subject';
import BaseRoutes from '../BaseRoutes';

const controller = new SubjectController();
class SubjectRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof SubjectSchema>> {
    constructor() {
        super(controller, 'subjects', 'subject');
    }
}

export default SubjectRoutes;
