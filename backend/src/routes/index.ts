import UserRoutes from './UserRoute';
import FoodItemRoutes from './FoodItemsRoute';
import AuthRoutes from './AuthRoute';
import { Router } from 'express';

const routes: Router[] = [];

routes.push(UserRoutes);
routes.push(FoodItemRoutes)
routes.push(AuthRoutes);

export function getRoutes() {
    return routes;
}



