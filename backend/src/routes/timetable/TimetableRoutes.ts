import { HydratedDocumentFromSchema } from 'mongoose';

import TimetableController from '../../controllers/timetable/TimetableController';
import BaseRoutes from '../BaseRoutes';

const controller = new TimetableController();
class TimetableRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'timetables', 'timetable');
    }
}

export default TimetableRoutes;
