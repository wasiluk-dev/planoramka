import { Express, Request, Response } from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/UserController';
import EHttpStatusCode from '../enums/EHttpStatusCode';

// TODO: implement some kind of API authentication
const UserRoutes = (app: Express) => {
    app.route('/users')
        .get((_req: Request, res: Response) => getAllUsers(res))
        .post((req: Request, res: Response) => {
            if (req.is('application/x-www-form-urlencoded')) createUser(req.body, res);
            else {
                res.sendStatus(EHttpStatusCode.UnsupportedMediaType);
                // TODO: return a RFC 7807 compliant error response instead (https://www.mscharhag.com/api-design/rest-error-format)
                // TODO-ish: return an accepted Content-Type in the Accept header? (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415)
                // res.send(
                //     {
                //         "type": "https://api.my-cool-example.com/problems/required-field-missing", // link to error's documentation
                //         "title": "Unsupported media type",
                //         "detail": "The endpoint accepts only 'application/x-www-url-encoded'.",
                //         "status": EHttpStatusCode.UnsupportedMediaType,
                //         "instance": "/users",
                //     }
                // );
            }
        })

    app.route('/users/:userId')
        .get((req: Request, res: Response) => getUser(req, res))
        .patch((req: Request, res: Response) => updateUser(req, res))
        .delete((req: Request, res: Response) => deleteUser(req, res))
};

export default UserRoutes;
