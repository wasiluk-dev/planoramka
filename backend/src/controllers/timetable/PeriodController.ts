import { HydratedDocumentFromSchema } from 'mongoose';

import Period from '../../models/timetable/Period';
import BaseController from '../BaseController';

const base = new Period();
class PeriodController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default PeriodController;
