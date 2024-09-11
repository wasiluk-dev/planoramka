import { HydratedDocumentFromSchema } from 'mongoose';

import Timetable, { TimetableSchema } from '../../models/timetable/Timetable';
import BaseController from '../BaseController';

const base = new Timetable();
class TimetableController extends BaseController<HydratedDocumentFromSchema<typeof TimetableSchema>> {
    constructor() {
        super(base);
    }
}

export default TimetableController;
