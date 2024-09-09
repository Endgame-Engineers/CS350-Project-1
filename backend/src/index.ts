import express from 'express';
const app = express();
import FoodItem from './models/FoodItems';

app.use(express.json());
const foodItems = new FoodItem();

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });