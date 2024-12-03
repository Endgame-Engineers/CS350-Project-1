import express from 'express';
import session from 'express-session';
import passport from 'passport';
import http from 'http';
import { config } from 'dotenv';
import { getRoutes } from './routes/index';
import AuthGoogle from './utils/AuthGoogle';
import path from 'path';

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

const vueJSStatic = path.join(__dirname, 'public');

app.use(express.static(vueJSStatic));
app.use(express.json());

const routes = getRoutes();
routes.forEach((route) => {
    app.use('/api', route);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(vueJSStatic, 'index.html'));
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;