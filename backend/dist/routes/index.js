"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoutes = getRoutes;
const UserRoute_1 = __importDefault(require("./UserRoute"));
const FoodItemsRoute_1 = __importDefault(require("./FoodItemsRoute"));
const routes = [];
routes.push(UserRoute_1.default);
routes.push(FoodItemsRoute_1.default);
function getRoutes() {
    return routes;
}
