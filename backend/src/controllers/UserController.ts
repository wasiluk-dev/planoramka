import { HydratedDocumentFromSchema } from 'mongoose';

import User, { UserSchema } from '../models/User';
import BaseController from './BaseController';

const base = new User();
class UserController extends BaseController<HydratedDocumentFromSchema<typeof UserSchema>> {
    constructor() {
        super(base);
    }
}

export default UserController;
