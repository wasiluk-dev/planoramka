import cors from 'cors';
import express, { Express } from 'express';
// import mongoSanitize from 'express-mongo-sanitize';
import methodOverride from 'method-override';

const app: Express = express();
app.use(cors({
    origin: `http://${ process.env.CLIENT_IP ?? '127.0.0.1' }:${ process.env.CLIENT_PORT ?? '5173' }`,
    methods: 'GET,POST,PATCH,DELETE,HEAD,OPTIONS',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(mongoSanitize({ allowDots: true }));

export default app;
