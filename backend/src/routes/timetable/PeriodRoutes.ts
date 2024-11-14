import { HydratedDocumentFromSchema } from 'mongoose';

import PeriodController from '../../controllers/timetable/PeriodController';
import { PeriodSchema } from '../../models/timetable/Period';
import BaseRoutes from '../BaseRoutes';

const controller = new PeriodController();
export default class PeriodRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof PeriodSchema>> {
    constructor() {
        super(controller, 'periods', 'period');
    }
}
