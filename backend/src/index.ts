import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');

    console.log(`Request received: ${req.url}`);
})

app.get('/hello', (req, res) => {
    res.send('Hello World!!');
})

app.get('/goodbye', (req, res) => {
    res.send('Goodbye World!!');
})

app.get('/test', (req, res) => {
    res.send('Test World!!');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });