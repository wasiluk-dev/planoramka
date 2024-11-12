import { HydratedDocumentFromSchema } from 'mongoose';

import ScheduleController from '../../controllers/timetable/ScheduleController';
import { ScheduleSchema } from '../../models/timetable/Schedule';
import BaseRoutes from '../BaseRoutes';

const controller = new ScheduleController();
export default class ScheduleRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof ScheduleSchema>> {
    constructor() {
        super(controller, 'schedules', 'schedule');
    }
}
