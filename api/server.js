const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');
const Redis = require('ioredis');

const app = express();
const port = 3011;

app.use(cors());

const speedConsumer = new Kafka({
    brokers: ['localhost:9092'],
}).consumer({ groupId: 'grp_api' });

const speedLimitsConsumer = new Kafka({
    brokers: ['localhost:9092'],
}).consumer({ groupId: 'grp_api2' });

const frameConsumer = new Kafka({
    brokers: ['localhost:9092'],
}).consumer({ groupId: 'grp_api3' });

const redis = new Redis();

let latestNumericalData = [0, 0, 0, 0];
let latestFrame;

speedConsumer.subscribe({ topic: 'sensor_data', fromBeginning: false })
    .then(() => {
        return speedConsumer.run({
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

speedLimitsConsumer.subscribe({ topic: 'speed_limits_data', fromBeginning: false })
    .then(() => {
        return speedLimitsConsumer.run({
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

frameConsumer.subscribe({ topic: 'frame_noticifation', fromBeginning: false })
    .then(() => {
        // Start the Kafka consumer for frames
        return frameConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                // Process the message and store the frame
                const metadataAndFrame = message.value.toString().split('new_frame');
                const metadata = JSON.parse(metadataAndFrame[1]);
                const frameBuffer = await redis.getBuffer('frame_jpeg:latest');

                latestFrame = { metadata, frameBuffer };
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
    if (latestFrame && latestFrame.frameBuffer) {
        const { metadata, frameBuffer } = latestFrame;

        res.setHeader('Content-Type', 'image/jpeg');

        console.log('Sending frame: ', metadata);
        
        res.end(frameBuffer);
    } else {
        res.status(404).send('No frame available');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
