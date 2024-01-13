import { loadObject } from '../utils/loadObject.mjs';
import * as THREE from 'three';
import { updateIzpis } from '../model_inits/display_init.mjs';

// komandeNaIndeksih = np.array(["prestavi kanal", "preveri porabo",
//                               "Prizgi klimatsko napravo", "prizgi radio", "ugasni klimatsko napravo", "ugasni radio"])
// radio_kanali = ["Radio 1", "Radio Center", "Koroški radio", "radio Aktual", "Val 202"]
let kanal = 0;
let radio_on = 0;
let ac_on = 0;
let radioStatus = "OFF";
let acStatus = "OFF";
let consumption = 7.9;
const radio_kanali = ["Radio 1", "Radio Center", "Koroški radio", "radio Aktual", "Val 202"];

function handleSuccess(data) {
    // Your logic here
    console.log('Success:', data);
    radioStatus = "ON"
    
    

    if (data.message == 0) {
        if(radio_on == 1) {
            kanal += 1;
            kanal = kanal % 5;
            radioStatus = radio_kanali[kanal];
        }
        // Code to handle when data.message is 0
    } else if (data.message == 1) {
        consumption += 0.1;
    } else if (data.message == 2) {
        acStatus = "ON";
    } else if (data.message == 3) {
        radio_on = 1;
    } else if (data.message == 4) {
        acStatus = "OFF";
    } else if (data.message == 5) {
        radioStatus = "OFF";
        radio_on = 0;
    }
    if(radio_on)radioStatus = radio_kanali[kanal];
    const newText = `RADIO:${radioStatus}   AC:${acStatus}   CONSUMPTION:${consumption}`;

    updateIzpis(newText, "");

}


const init = function (object) {
    object.position.y = -0.55;
    object.position.z = 0.44;
    object.position.x = 0.9;
    //object.rotation.x = Math.PI / 2;
    object.rotation.y = Math.PI;
    object.scale.set(1.9, 1.9, 1.9);


    for (let i = 0; i < object.children.length; i++) {
        
        if (object.children[i].name === "leftDial") {

             object.children[i].onClicked = function () {
                 console.log("dial clicked");
                 updateIzpis("","Recording...");
                    //ob pritisku sprozi snemanje na serverju:
                    fetch('http://127.0.0.1:5000/start_recording', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 'flag': true }),
                    })
                    .then(response => response.json())
                    .then((handleSuccess))
                    .catch(error => console.error('Error:', error));
             }

            }

            if (object.children[i].name === "screen") {
                // object.children[i].onClicked = function () {
                //     console.log("kuku");
                // }
                //object.geometry.computeBoundingBox();
 



                
            }

    }
    

}

export const loadAirConditioning = async () => {
    try {
        var myObject = await loadObject("models/air_conditioning/air_conditioning.obj", "models/air_conditioning/air_conditioning.mtl");
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}