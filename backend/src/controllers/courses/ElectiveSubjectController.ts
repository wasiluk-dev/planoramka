import { HydratedDocumentFromSchema } from 'mongoose';

import ElectiveSubject, { ElectiveSubjectSchema } from '../../models/courses/ElectiveSubject';
import BaseController from '../BaseController';

const base = new ElectiveSubject();
class ElectiveSubjectController extends BaseController<HydratedDocumentFromSchema<typeof ElectiveSubjectSchema>> {
    constructor() {
        super(base);
    }
}

export default ElectiveSubjectController;
