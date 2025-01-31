import MongoStore from 'connect-mongo';
import session from 'express-session';
import { MongoClient } from 'mongodb';
import db from 'mongoose';
import * as fs from 'node:fs';
import * as https from 'node:https';

import app from './app';
import routes from './routes/.index';

const dbUri: string = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_IP}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=${process.env.DB_AUTH}`;
const dbClient: Promise<MongoClient> = MongoClient.connect(dbUri);
const srvOptions = {
    cert: fs.readFileSync(process.cwd() + '/ssl/cert.pem'),
    key: fs.readFileSync(process.cwd() + '/ssl/key.pem'),
}

// sessions
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
        httpOnly: false,
    },
    store: MongoStore.create({
        clientPromise: dbClient,
        ttl: 60 * 60, // 1 hour
    }),
}));

// routes
Object.keys(routes).forEach(key => {
    const RouteClass = routes[key as keyof typeof routes];
    const routeInstance = new RouteClass();
    routeInstance.route(app);
});

(() => {
    db.connect(dbUri)
        .then(() => {
            console.log(`Connected to a MongoDB instance at: https://${process.env.DB_IP}:${process.env.DB_PORT}`);
            https.createServer(srvOptions, app).listen(process.env.SERVER_PORT, () => {
                return console.log(`API server started listening at: https://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`);
            });
        })
        .catch(err => {
            throw err;
        });

    db.set('debug', String(process.env.DEBUG).toLowerCase() === 'true');
})();
