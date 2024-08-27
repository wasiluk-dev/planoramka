import { HydratedDocumentFromSchema } from 'mongoose';

import ClassController from '../../controllers/timetable/ClassController';
import BaseRoutes from '../BaseRoutes';

const controller = new ClassController();
class ClassRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'classes', 'class');
    }
}

export default ClassRoutes;
