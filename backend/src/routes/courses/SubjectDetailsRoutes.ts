import { HydratedDocumentFromSchema } from 'mongoose';

import SubjectDetailsController from '../../controllers/courses/SubjectDetailsController';
import { SubjectDetailsSchema } from '../../models/courses/SubjectDetails';
import BaseRoutes from '../BaseRoutes';

const controller = new SubjectDetailsController();
export default class SubjectDetailsRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof SubjectDetailsSchema>> {
    constructor() {
        super(controller, 'subject-details', 'subjectDetails');
    }
}
