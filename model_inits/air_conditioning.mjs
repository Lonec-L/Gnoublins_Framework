import { loadObject } from '../utils/loadObject.mjs';
import * as THREE from 'three';
import { updateIzpis  } from '../model_inits/display_init.mjs';

// komandeNaIndeksih = np.array(["prestavi kanal", "preveri porabo",
//                               "Prizgi klimatsko napravo", "prizgi radio", "ugasni klimatsko napravo", "ugasni radio"])
// radio_kanali = ["Radio 1", "Radio Center", "Koroški radio", "radio Aktual", "Val 202"]

let radioStatus = "OFF";
let acStatus = "OFF";
let consumption = 7.9;
function handleSuccess(data) {
    // Your logic here
    console.log('Success:', data);
    radioStatus = "ON"
    const newText = `RADIO:${radioStatus} AC:${acStatus} CONSUMPTION:${consumption}`;
    updateIzpis(newText);

    if(data.message == 3){
        
    }


}


const init = function (object) {
    object.position.y = -0.55;
    object.position.z = 0.44;
    object.position.x = 0.8;
    //object.rotation.x = Math.PI / 2;
    object.rotation.y = Math.PI;
    object.scale.set(1.9, 1.9, 1.9);


    for (let i = 0; i < object.children.length; i++) {
        
        if (object.children[i].name === "leftDial") {

             object.children[i].onClicked = function () {
                 console.log("dial clicked");
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