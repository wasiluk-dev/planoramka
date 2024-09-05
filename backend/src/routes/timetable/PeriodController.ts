import { HydratedDocumentFromSchema } from 'mongoose';

import PeriodController from '../../controllers/timetable/PeriodController';
import BaseRoutes from '../BaseRoutes';

const controller = new PeriodController();
class PeriodRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'periods', 'period');
    }
}

export default PeriodRoutes;
