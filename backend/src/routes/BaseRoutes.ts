import { Express, Request, Response } from 'express';
import { Document } from 'mongoose';

import BaseController from '../controllers/BaseController';
import EHttpStatusCode from '../enums/EHttpStatusCode';

abstract class BaseRoutes<T extends Document> {
    private readonly _controller: BaseController<T>;
    private prefix: string;
    private suffix: string;

    protected constructor(controller: BaseController<T>, resourceName: string, parameterName: string) {
        this._controller = controller;
        this.prefix = '/' + resourceName;
        this.suffix = '/:' + parameterName + 'Id';
    }

    // TODO: implement some kind of API authentication
    route = (app: Express): void => {
        app.route(this.prefix)
            .get((req: Request, res: Response) => this._controller.getByFilter(res, req.body))
            .post((req: Request, res: Response) => {
                if (req.is('application/x-www-form-urlencoded')) this._controller.post(res, req.body);
                else {
                    res.sendStatus(EHttpStatusCode.UnsupportedMediaType);
                    // TODO-ish: return a RFC 7807 compliant error response instead (https://www.mscharhag.com/api-design/rest-error-format)
                    // TODO-ish: return an accepted Content-Type in the Accept header (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415)
                    // res.send(
                    //     {
                    //         "type": "https://api.my-cool-example.com/problems/required-field-missing", // link to error's documentation
                    //         "title": "Unsupported media type",
                    //         "detail": "The endpoint accepts only 'application/x-www-url-encoded'.",
                    //         "status": EHttpStatusCode.UnsupportedMediaType,
                    //         "instance": this.prefix,
                    //     }
                    // );
                }
            })
            .patch((req: Request, res: Response) => this._controller.patchByFilter(res, req.body.filter, req.body.update))
            .delete((req: Request, res: Response) => this._controller.deleteByFilter(res, req.body));

        app.route(this.prefix + this.suffix)
            .get((req: Request, res: Response) => this._controller.getById(res, req.params.userId))
            .patch((req: Request, res: Response) => this._controller.patchById(res, req.params.userId, req.body))
            .delete((req: Request, res: Response) => this._controller.deleteById(res, req.params.userId))
    }

    get controller(): BaseController<T> {
        return this._controller;
    }
}

export default BaseRoutes;
