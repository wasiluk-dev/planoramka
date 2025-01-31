import { HydratedDocumentFromSchema } from 'mongoose';

import BaseController from '../BaseController';
import PersonalTimetable, { PersonalTimetableSchema } from '../../models/timetable/PersonalTimetable';

const base = new PersonalTimetable();
class PersonalTimetableController extends BaseController<HydratedDocumentFromSchema<typeof PersonalTimetableSchema>> {
    constructor() {
        super(base);
    }
}

export default PersonalTimetableController;
