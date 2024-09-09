"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const pg_1 = require("pg");
(0, dotenv_1.config)();
class FoodItems {
    constructor() {
        this.client = new pg_1.Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
        });
        this.client.connect();
    }
    getFoodItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.query('SELECT * FROM "FoodItems"');
            return result.rows;
        });
    }
    getFoodItem(barcode) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.query('SELECT * FROM "FoodItems" WHERE barcode = $1', [barcode]);
            return result.rows[0];
        });
    }
    addFoodItem(foodItem) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.query('INSERT INTO "FoodItems" (FoodName, Barcode, protein_per_serv, carb_per_serv, fat_per_serv, grams_per_serv, calories_per_serv) VALUES ($1, $2, $3, $4, $5, $6, $7)', [foodItem.foodname, foodItem.barcode, foodItem.protein_per_serv, foodItem.carb_per_serv, foodItem.fat_per_serv, foodItem.grams_per_serv, foodItem.calories_per_serv]);
        });
    }
    updateFoodItem(foodItem) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.query('UPDATE "FoodItems" SET FoodName = $1, protein_per_serv = $2, carb_per_serv = $3, fat_per_serv = $4, grams_per_serv = $5, calories_per_serv = $6 WHERE Barcode = $7', [foodItem.foodname, foodItem.protein_per_serv, foodItem.carb_per_serv, foodItem.fat_per_serv, foodItem.grams_per_serv, foodItem.calories_per_serv, foodItem.barcode]);
        });
    }
    deleteFoodItem(barcode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.query('DELETE FROM "FoodItems" WHERE Barcode = $1', [barcode]);
        });
    }
    close() {
        this.client.end();
    }
}
exports.default = FoodItems;
