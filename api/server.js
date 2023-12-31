const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3011;

app.use(cors());

app.get('/data', (req, res) => {
    // TODO: Get the data from kafka/redis

    numericalData = [];
    numericalData[0] = Math.floor(Math.random() * 11);    // Speed limit
    numericalData[1] = Math.floor(Math.random() * 131);   // Speed
    numericalData[2] = Math.floor(Math.random() * 100);   // Driver score
    numericalData[3] = Math.floor(Math.random() * 8000);  // RPM
    numericalData[4] = Math.floor(Math.random() * 4);     // Blinkers

    res.json({ data: numericalData });
});

app.get('/dashboard_lights_data', (req, res) => {
    // TODO: Get the data from kafka/redis

    numericalData = [];
    numericalData[0] = Math.floor(Math.random() * 2);     // Dashboard lights random
    numericalData[1] = Math.floor(Math.random() * 2);     // Dashboard lights random
    numericalData[2] = Math.floor(Math.random() * 2);     // Dashboard lights random

    res.json({ data: numericalData });
});

app.get('/image', (req, res) => {
    // TODO: Get the data from kafka/redis

    try {
        const imagePath = path.resolve(__dirname, '../models/surroundings/sampleBackground.jpg');

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', 'inline; filename=image.jpg');

        res.sendFile(imagePath);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
