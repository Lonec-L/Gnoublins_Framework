const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const Redis = require('ioredis');
const redis = new Redis(6379);

const app = express();
const port = 3011;

app.use(cors());
app.use(bodyParser.json());

var prevID = 0;

app.get('/data', (req, res) => {
    // TODO: Get the data from kafka/redis

    receivedData = 0;
    integerValue= 0;
    
    app.post('/receive_data', (req, res) => {
        receivedData = req.body;
        console.log('Received data:', receivedData);
        res.send('Data received successfully');
        integerValue = receivedData.ID;

        if(prevID !== integerValue){
            prevID = integerValue
        }

        console.log(integerValue)
      });

    numericalData = [];
    numericalData[0] = Math.floor(Math.random() * 11);    // Speed limit
    numericalData[1] = Math.floor(Math.random() * 131);   // Speed
    numericalData[2] = Math.floor(Math.random() * 100);   // Driver score
    numericalData[3] = Math.floor(Math.random() * 8000);  // RPM
    numericalData[4] = Math.floor(Math.random() * 4);     // Blinkers
    numericalData[5] = Math.floor(Math.random() * 8);     // Roadsign ID
    numericalData[6] = prevID                      // Voice massgae ID

    res.json({ data: numericalData });
});


const mqtt = require("mqtt");

const clientId = "Gnoublin" + Math.random().toString(36).substring(7);
const client = mqtt.connect("mqtt://localhost:1883", { protocolId: 'MQTT', clientId: clientId });

console.log("connected flag  " + client.connected);

gnoublins_data = [];
client.subscribe("Accel");
client.on("message", (topic, message) => {
    // message is Buffer
    var t = topic.toString();
    var m = message.toString();
    if (t == "Accel") {
        gnoublins_data[1] = parseInt(m[0]);
        if (gnoublins_data[2] != 1)
            gnoublins_data[2] = parseInt(m[1]);
        console.log(gnoublins_data);
    }
    if (t == "OnConstructionSite") {
        gnoublins_data[0] = parseInt(m[0]);
    }
});

app.get('/dashboard_lights_data', (req, res) => {
    res.json({ data: gnoublins_data });
});

const jpeg = require("jpeg-js");

app.get('/image', async (req, res) => {
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

app.get('/imageFromRedis', async (req, res) => {
    try {

        const frameBuffer = await redis.getBuffer('frame:latest');
        var array = new Uint8Array(frameBuffer);

        var frameData = new Buffer.alloc(960 * 540 * 4, 0xff);

        var j = 0;
        for (var i = 0; i < array.length; i += 3) {
            var temp = array[i + 2];
            array[i + 2] = array[i];
            array[i] = temp;

            frameData[j] = array[i];
            frameData[j + 1] = array[i + 1];
            frameData[j + 2] = array[i + 2];
            j += 4;
        }
        var rawImageData = {
            data: frameData,
            width: 960,
            height: 540
        };

        var jpegImageData = jpeg.encode(rawImageData, 50);

        res.setHeader('Content-Type', 'image/jpeg');
        console.log("jpeg");
        res.end(jpegImageData.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
