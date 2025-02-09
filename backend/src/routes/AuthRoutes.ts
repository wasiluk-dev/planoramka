import { Express, Request, Response } from 'express';
import { FilterQuery, HydratedDocumentFromSchema, Model } from 'mongoose';

import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import EHttpStatusCode from '../enums/EHttpStatusCode';
import User, { UserSchema } from '../models/User';
import DBUtils from '../utils/DBUtils';

export default class AuthRoutes {
    private prefix: string = '/auth';

    route = (app: Express): void => {
        app.get(this.prefix + '/session', (req: Request, res: Response) => {
            if (req.session.user) {
                res.status(EHttpStatusCode.Ok).json(req.session.user);
            } else {
                res.status(EHttpStatusCode.Unauthorized).json('api_session_unauthorized');
            }
        });

        app.post(this.prefix + '/login', (req: Request, res: Response) => {
            const { username, password } = req.body;
            const model: Model<HydratedDocumentFromSchema<typeof UserSchema>> = new UserController().base.model;
            const filter: FilterQuery<HydratedDocumentFromSchema<typeof UserSchema>> = { username: username };

            // TODO: try to fix the model type
            // @ts-ignore
            DBUtils.find(model, filter)
                .then(users => {
                    if (users.length === 0) {
                        res.status(EHttpStatusCode.Unauthorized).json('api_login_credentials_invalid');
                    } else if (users.length === 1) {
                        // TODO: try to fix the variable type
                        // @ts-ignore
                        const user: HydratedDocumentFromSchema<typeof UserSchema> = users[0];
                        AuthController.validateCredentials(username, password)
                            .then(areCredentialsValid => {
                                if (areCredentialsValid) {
                                    req.session.user = {
                                        _id: user._id,
                                        username: user.username,
                                        title: user.title,
                                        names: user.names,
                                        surnames: user.surnames,
                                        role: user.role,
                                    };

                                    res.status(EHttpStatusCode.Ok).json(req.session.user);
                                } else {
                                    res.status(EHttpStatusCode.Unauthorized).json('api_login_credentials_invalid');
                                }
                            })
                            .catch(err => {
                                res.status(EHttpStatusCode.InternalServerError).json(err.toString());
                            });
                    } else {
                        res.sendStatus(EHttpStatusCode.InternalServerError);
                    }
                })
                .catch(err => {
                    res.status(EHttpStatusCode.InternalServerError).json(err.toString())
                });
        });
        app.post(this.prefix + '/logout', (req: Request, res: Response) => {
            const sessionUser = req.session.user;
            req.session.destroy(err => {
                if (err) {
                    res.status(EHttpStatusCode.InternalServerError).json(err.toString());
                } else {
                    res.status(EHttpStatusCode.Ok).json(sessionUser);
                }
            });
        });
        app.post(this.prefix + '/register', (req: Request, res: Response) => {
            const { username, password, names, surnames } = req.body;
            new User().create({
                username: username,
                password: password,
                names: names,
                surnames: surnames,
            } as HydratedDocumentFromSchema<typeof UserSchema>)
                .then((docs) => {
                    if (docs instanceof Array) {
                        const body = [];
                        for (const doc of docs) {
                            body.push({
                                username: doc.username,
                                names: doc.names,
                                surnames: doc.surnames,
                                role: doc.role,
                            });
                        }

                        res.status(EHttpStatusCode.Created).json(body);
                    } else {
                        res.status(EHttpStatusCode.Created).json({
                            username: docs.username,
                            names: docs.names,
                            surnames: docs.surnames,
                            role: docs.role,
                        });
                    }
                })
                .catch((err) => {
                    res.status(EHttpStatusCode.InternalServerError).json(err.toString());
                });
        });
    }
}
