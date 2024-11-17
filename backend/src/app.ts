import cors from 'cors';
import express, { Express } from 'express';
// import mongoSanitize from 'express-mongo-sanitize';
import methodOverride from 'method-override';

const app: Express = express();
export default app;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PATCH,DELETE,HEAD,OPTIONS',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(mongoSanitize({ allowDots: true }));
