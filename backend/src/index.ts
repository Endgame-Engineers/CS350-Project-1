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

app.use(passport.initialize());
app.use(passport.session());

new AuthGoogle();
app.use(express.json());

const routes = getRoutes();
routes.forEach((route) => {
    app.use('/api', route);
});

app.get('/', (req, res) => {
    if (req.user) {
        res.status(200).json({ message: 'Authenticated' });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});