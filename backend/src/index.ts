import express from 'express';
const app = express();
import FoodItem from './models/FoodItems';
import User from './models/Users';

app.use(express.json());
const foodItems = new FoodItem();
const Users = new User();

app.get('/food_items', async (req, res) => {
    const items = await foodItems.getFoodItems();
    res.json(items);
});

app.get('/food_items/:barcode', async (req, res) => {
    const item = await foodItems.getFoodItem(req.params.barcode);
    res.json(item);
});

app.post('/food_items', async (req, res) => {
    await foodItems.addFoodItem(req.body);
    res.status(201).send();
});

app.put('/food_items', async (req, res) => {
    await foodItems.updateFoodItem(req.body);
    res.status(200).send();
});

app.delete('/food_items/:barcode', async (req, res) => {
    await foodItems.deleteFoodItem(req.params.barcode);
    res.status(200).send();
});

app.get('/users', async (req, res) => {
    const users = await Users.getUsers();
    res.json(users);
});

app.get('/users/:username', async (req, res) => {
    const user = await Users.getUser(req.params.username);
    res.json(user);
});

app.post('/users', async (req, res) => {
    await Users.addUser(req.body);
    res.status(201).send();
});

app.put('/users', async (req, res) => {
    await Users.updateUser(req.body);
    res.status(200).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });