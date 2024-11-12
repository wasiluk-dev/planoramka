import { HydratedDocumentFromSchema } from 'mongoose';

import ElectiveSubjectController from '../../controllers/courses/ElectiveSubjectController';
import { ElectiveSubjectSchema } from '../../models/courses/ElectiveSubject';
import BaseRoutes from '../BaseRoutes';

const controller = new ElectiveSubjectController();
export default class ElectiveSubjectRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof ElectiveSubjectSchema>> {
    constructor() {
        super(controller, 'elective-subjects', 'electiveSubject');
    }
}
