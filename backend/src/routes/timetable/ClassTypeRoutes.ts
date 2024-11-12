import { HydratedDocumentFromSchema } from 'mongoose';

import ClassTypeController from '../../controllers/timetable/ClassTypeController';
import { ClassTypeSchema } from '../../models/timetable/ClassType';
import BaseRoutes from '../BaseRoutes';

const controller = new ClassTypeController();
export default class ClassTypeRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof ClassTypeSchema>> {
    constructor() {
        super(controller, 'class-types', 'classType');
    }
}
