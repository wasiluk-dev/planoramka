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
                res.status(EHttpStatusCode.Unauthorized).json('The user is not logged in');
            }
        });

        app.post(this.prefix + '/login', (req: Request, res: Response) => {
            const { username, password } = req.body;
            const model: Model<HydratedDocumentFromSchema<typeof UserSchema>> = new UserController().base.model;
            const filter: FilterQuery<HydratedDocumentFromSchema<typeof UserSchema>> = { username: username };

            // TODO: fix the model type
            // @ts-ignore
            DBUtils.find(model, filter)
                .then((users) => {
                    if (users.length === 0) {
                        res.sendStatus(EHttpStatusCode.NotFound);
                    } else if (users.length === 1) {
                        // TODO: fix the variable type
                        // @ts-ignore
                        const user: HydratedDocumentFromSchema<typeof UserSchema> = users[0];
                        AuthController.validateCredentials(username, password)
                            .then((areCredentialsValid) => {
                                if (areCredentialsValid) {
                                    // TODO: decide which user properties to return
                                    req.session.user = {
                                        username: user.username,
                                        names: user.names,
                                        surnames: user.surnames,
                                        courses: user.courses,
                                        role: user.role,
                                    };

                                    // res.sendStatus(EHttpStatusCode.Ok);
                                    res.status(EHttpStatusCode.Ok).json(req.session.user);
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
            req.session.destroy((err) => {
                if (err) {
                    res.status(EHttpStatusCode.InternalServerError).json(err.toString());
                }

                res.status(EHttpStatusCode.Ok).json(sessionUser);
            });
        });
        app.post(this.prefix + '/register', (req: Request, res: Response) => {
            const { username, password, names, surnames } = req.body;
            new User().create([{
                username: username,
                password: password,
                names: names,
                surnames: surnames,
            }] as HydratedDocumentFromSchema<typeof UserSchema>[])
                .then((documents: HydratedDocumentFromSchema<typeof UserSchema>[]) => {
                    // TODO: decide what fields should be saved in req.session
                    const body = [];
                    for (const r of documents) {
                        body.push({
                            username: r.username,
                            names: r.names,
                            surnames: r.surnames,
                            role: r.role,
                            courses: r.courses,
                        });
                    }

                    res.status(EHttpStatusCode.Created).json(body);
                })
                .catch((err) => {
                    res.status(EHttpStatusCode.InternalServerError).json(err.toString());
                });
        });
    }
}
