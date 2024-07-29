import { HydratedDocument } from 'mongoose';
import EHttpStatusCode from '../enums/EHttpStatusCode';

type DBResult<T> = {
    code: EHttpStatusCode,
    body?: Array<HydratedDocument<T>> | HydratedDocument<T>,
}

export default DBResult;
