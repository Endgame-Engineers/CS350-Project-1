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
const Users_1 = __importDefault(require("./models/Users"));
app.use(express_1.default.json());
const foodItems = new FoodItems_1.default();
const Users = new Users_1.default();
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
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield Users.getUsers();
    res.json(users);
}));
app.get('/users/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Users.getUser(req.params.username);
    res.json(user);
}));
app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Users.addUser(req.body);
    res.status(201).send();
}));
app.put('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Users.updateUser(req.body);
    res.status(200).send();
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
INSERT;
INTO;
Users(id, username, firstname, lastname, email, uuid, lastlogin);
VALUES(id, integer, 'username:character varying', 'firstname:character varying', 'lastname:character varying', 'email:character varying', 'uuid:uuid', 'lastlogin:timestamp with time zone');
