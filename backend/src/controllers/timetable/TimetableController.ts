import { HydratedDocumentFromSchema } from 'mongoose';

import Timetable from '../../models/timetable/Timetable';
import BaseController from '../BaseController';

const base = new Timetable();
class TimetableController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default TimetableController;
