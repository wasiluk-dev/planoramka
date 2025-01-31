import { HydratedDocumentFromSchema } from 'mongoose';

import BaseRoutes from '../BaseRoutes';
import PersonalTimetableController from '../../controllers/timetable/PersonalTimetableController';
import { PersonalTimetableSchema } from '../../models/timetable/PersonalTimetable';

const controller = new PersonalTimetableController();
export default class PersonalTimetableRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof PersonalTimetableSchema>> {
    constructor() {
        super(controller, 'personal-timetables', 'personalTimetable');
    }
}
