import { HydratedDocumentFromSchema } from 'mongoose';

import UserController from '../controllers/UserController';
import BaseRoutes from './BaseRoutes';

const controller = new UserController();
class UserRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof controller.base.schema>> {
    constructor() {
        super(controller, 'users', 'user');
    }
}

export default UserRoutes;
