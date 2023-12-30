const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');
const Redis = require('ioredis');
const path = require('path');

const app = express();
const port = 3011;

app.use(cors());

const consumer = new Kafka({
    brokers: ['localhost:9092'],
}).consumer({ groupId: 'grp_api' });

const consumer2 = new Kafka({
    brokers: ['localhost:9092'],
}).consumer({ groupId: 'grp_api2' });

const redis = new Redis();

let latestNumericalData = [0, 0, 0, 0];

consumer.subscribe({ topic: 'sensor_data', fromBeginning: false })
    .then(() => {
        return consumer.run({
            eachMessage: ({ topic, partition, message }) => {
                // Process the message and update the latest data
                const data = message.value.toString().split('|');
                latestNumericalData[1] = parseInt(data[0]); // Speed
                latestNumericalData[3] = parseInt(data[1]); // RPM
            },
        });
    })
    .catch(error => {
        console.error(error);
    });

consumer2.subscribe({ topic: 'speed_limits_data', fromBeginning: false })
    .then(() => {
        return consumer2.run({
            eachMessage: ({ topic, partition, message }) => {
                // Process the message and update the latest data
                const data = message.value.toString().split('|');
                latestNumericalData[0] = parseInt(data[0]);  // Speed limit
                latestNumericalData[2] = parseInt(data[1]);  // Driver score
            },
        });
    })
    .catch(error => {
        console.error(error);
    });

app.get('/data', (req, res) => {
    res.json({ data: latestNumericalData });
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
