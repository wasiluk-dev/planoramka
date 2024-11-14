import { HydratedDocumentFromSchema } from 'mongoose';

import UserController from '../controllers/UserController';
import { UserSchema } from '../models/User';
import BaseRoutes from './BaseRoutes';

const controller = new UserController();
export default class UserRoutes extends BaseRoutes<HydratedDocumentFromSchema<typeof UserSchema>> {
    constructor() {
        super(controller, 'users', 'user');
    }
}
