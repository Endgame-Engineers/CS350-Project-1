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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFoodItem = addFoodItem;
exports.updateFoodItem = updateFoodItem;
exports.deleteFoodItem = deleteFoodItem;
exports.getFoodItems = getFoodItems;
exports.getFoodItem = getFoodItem;
const ConnectToDB_1 = __importDefault(require("../utils/ConnectToDB"));
class FoodItems {
    constructor() {
        this.client = new ConnectToDB_1.default().connect();
    }
    getFoodItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (yield this.client).query('SELECT * FROM "FoodItems"');
            return result.rows;
        });
    }
    getFoodItem(barcode) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (yield this.client).query('SELECT * FROM "FoodItems" WHERE barcode = $1', [barcode]);
            return result.rows[0];
        });
    }
    addFoodItem(foodItem) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.client).query('INSERT INTO "FoodItems" (FoodName, Barcode, protein_per_serv, carb_per_serv, fat_per_serv, grams_per_serv, calories_per_serv) VALUES ($1, $2, $3, $4, $5, $6, $7)', [foodItem.foodname, foodItem.barcode, foodItem.protein_per_serv, foodItem.carb_per_serv, foodItem.fat_per_serv, foodItem.grams_per_serv, foodItem.calories_per_serv]);
            return foodItem;
        });
    }
    updateFoodItem(foodItem) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.client).query('UPDATE "FoodItems" SET FoodName = $1, protein_per_serv = $2, carb_per_serv = $3, fat_per_serv = $4, grams_per_serv = $5, calories_per_serv = $6 WHERE Barcode = $7', [foodItem.foodname, foodItem.protein_per_serv, foodItem.carb_per_serv, foodItem.fat_per_serv, foodItem.grams_per_serv, foodItem.calories_per_serv, foodItem.barcode]);
        });
    }
    deleteFoodItem(barcode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (yield this.client).query('DELETE FROM "FoodItems" WHERE Barcode = $1', [barcode]);
        });
    }
    close() {
        ConnectToDB_1.default.close(this.client);
    }
}
function addFoodItem(foodItem) {
    new FoodItems().addFoodItem(foodItem);
}
function updateFoodItem(foodItem) {
    new FoodItems().updateFoodItem(foodItem);
}
function deleteFoodItem(barcode) {
    new FoodItems().deleteFoodItem(barcode);
}
function getFoodItems() {
    return new FoodItems().getFoodItems();
}
function getFoodItem(barcode) {
    return new FoodItems().getFoodItem(barcode);
}
