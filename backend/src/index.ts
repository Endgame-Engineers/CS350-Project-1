import express from 'express';
import session from 'express-session';
import passport from 'passport';
import http from 'http';
import { config } from 'dotenv';
import { getRoutes } from './routes/index';
import AuthGoogle from './utils/AuthGoogle';

config();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
}));

new AuthGoogle();

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const routes = getRoutes();
routes.forEach((route) => {
    app.use('/api', route);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});