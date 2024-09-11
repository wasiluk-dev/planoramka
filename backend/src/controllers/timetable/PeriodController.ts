import { HydratedDocumentFromSchema } from 'mongoose';

import Period, { PeriodSchema } from '../../models/timetable/Period';
import BaseController from '../BaseController';

const base = new Period();
class PeriodController extends BaseController<HydratedDocumentFromSchema<typeof PeriodSchema>> {
    constructor() {
        super(base);
    }
}

export default PeriodController;
