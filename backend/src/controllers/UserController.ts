import { HydratedDocumentFromSchema } from 'mongoose';

import User from '../models/User';
import BaseController from './BaseController';

const base = new User();
class UserController extends BaseController<HydratedDocumentFromSchema<typeof base.schema>> {
    constructor() {
        super(base);
    }
}

export default UserController;
