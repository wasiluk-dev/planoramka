import { HydratedDocumentFromSchema } from 'mongoose';

import TimetableController from '../../controllers/timetable/TimetableController';
import { TimetableSchema } from '../../models/timetable/Timetable';
import BaseRoutes from '../BaseRoutes';

const controller = new TimetableController();
export default class TimetableRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof TimetableSchema>> {
    constructor() {
        super(controller, 'timetables', 'timetable');
    }
}
