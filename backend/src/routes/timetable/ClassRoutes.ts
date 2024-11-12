import { HydratedDocumentFromSchema } from 'mongoose';

import ClassController from '../../controllers/timetable/ClassController';
import { ClassSchema } from '../../models/timetable/Class';
import BaseRoutes from '../BaseRoutes';

const controller = new ClassController();
export default class ClassRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof ClassSchema>> {
    constructor() {
        super(controller, 'classes', 'class');
    }
}
