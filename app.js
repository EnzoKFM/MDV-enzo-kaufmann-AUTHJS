import express from 'express';
import authentificationRouter from './routes/authentificationRoutes.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

// JWT
app.use(cookieParser());

app.use(session({ secret: 'super-secret', resave: false, saveUninitialized: true }));

app.get('/', (req, res, next) => {
    res.render('index')
})

app.use('/apiauth', authentificationRouter);

app.listen(port, () => {
    console.log(`server listen on port ${port}`)
})