const express = require('express');
const cors = require('cors');

const app = express();
const port = 3011;

app.use(cors());

app.get('/data', (req, res) => {
    // TODO: Get the data from kafka/redis

    randomNumbers = [];
    randomNumbers[0] = Math.floor(Math.random() * 11);    // Speed limit
    randomNumbers[1] = Math.floor(Math.random() * 131);   // Speed
    randomNumbers[2] = Math.floor(Math.random() * 100);   // Driver score
    randomNumbers[3] = Math.floor(Math.random() * 8000);  // RPM
    res.json({ data: randomNumbers });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
