import express from 'express';
import { getRoutes } from './routes/index';
const app = express();
app.use(express.json());

const routes = getRoutes();
routes.forEach((route) => {
    app.use('/api', route);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });