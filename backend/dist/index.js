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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const FoodItems_1 = __importDefault(require("./models/FoodItems"));
app.use(express_1.default.json());
const foodItems = new FoodItems_1.default();
app.get('/food_items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield foodItems.getFoodItems();
    res.json(items);
}));
app.get('/food_items/:barcode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield foodItems.getFoodItem(req.params.barcode);
    res.json(item);
}));
app.post('/food_items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield foodItems.addFoodItem(req.body);
    res.status(201).send();
}));
app.put('/food_items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield foodItems.updateFoodItem(req.body);
    res.status(200).send();
}));
app.delete('/food_items/:barcode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield foodItems.deleteFoodItem(req.params.barcode);
    res.status(200).send();
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
