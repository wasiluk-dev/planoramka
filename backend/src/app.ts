import cors from 'cors';
import express, { Express } from 'express';
// import mongoSanitize from 'express-mongo-sanitize';
import methodOverride from 'method-override';
import routes from './routes/.index';

const app: Express = express();
export default app;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(mongoSanitize({ allowDots: true }));

Object.keys(routes).forEach((key) => {
    const RouteClass = routes[key as keyof typeof routes];
    const routeInstance = new RouteClass();
    routeInstance.route(app);
});
