import UserRoutes from './UserRoute';
import FoodItemRoutes from './FoodItemsRoute';
import { Router } from 'express';

const routes: Router[] = [];

routes.push(UserRoutes);
routes.push(FoodItemRoutes)

export function getRoutes() {
    return routes;
}



