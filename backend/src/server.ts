import MongoStore from 'connect-mongo';
import session from 'express-session';
import { MongoClient } from 'mongodb';
import db from 'mongoose';

import app from './app';

const dbUri: string = `mongodb://${process.env.DB_IP}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const dbClient: Promise<MongoClient> = MongoClient.connect(dbUri);

db.connect(dbUri)
    .then(() => console.log('DB connection established'))
    .catch(err => {
        throw err;
    });

app.use(session({
    // TODO: create an npm script that creates random secrets, then switch to process.env.SESSION_SECRET
    secret: '1v8d7a6f1ew81f576df1i687s1f6as',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        clientPromise: dbClient,
    }),
}));

app.listen(process.env.SERVER_PORT, () => {
    // TODO: change to HTTPS after implementing SSL
    return console.log(`Server started running at: http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}`);
});
