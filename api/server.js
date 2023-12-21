const express = require('express');
const cors = require('cors');

const app = express();
const port = 3011;

app.use(cors());

app.get('/data', (req, res) => {
    // TODO: Get the data from kafka/redis

    const randomNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100));
    res.json({ numbers: randomNumbers });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
