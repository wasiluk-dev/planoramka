import { HydratedDocumentFromSchema } from 'mongoose';

import Schedule, { ScheduleSchema } from '../../models/timetable/Schedule';
import BaseController from '../BaseController';

const base = new Schedule();
class ScheduleController extends BaseController<HydratedDocumentFromSchema<typeof ScheduleSchema>> {
    constructor() {
        super(base);
    }
}

export default ScheduleController;
