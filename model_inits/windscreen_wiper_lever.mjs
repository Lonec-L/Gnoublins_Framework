import { loadObject } from '../utils/loadObject.mjs';
import * as THREE from 'three';

const init = function (object) {
    object.position.z = 0.6;
    object.position.y = -0.62;
    object.position.x = 0.24;

    object.rotation.y = 1.5;
    object.scale.set(1.75, 1.75, 1.75);


    for (let i = 0; i < object.children.length; i++) {
        
        if (object.children[i].name === "Text.001") {
            object.lever_pos = new THREE.Vector3(0, 0.00, -0.15);
            object.pos_ctr = 0;

             object.children[i].onClicked = function () {
                 console.log("lever moved");
                 object.pos_ctr += 1;
                    if(object.pos_ctr != 5)
                    {
                    object.children[i].position.sub(object.lever_pos);
                    object.children[i].position.applyAxisAngle(new THREE.Vector3(-1, 0, 0), 0.040);
                    object.children[i].position.add(object.lever_pos);
                    object.children[i].rotateOnAxis(new THREE.Vector3(-1, 0, 0), 0.040);
                    
                    }else if(object.pos_ctr == 5) {
                        object.children[i].position.sub(object.lever_pos);
                        object.children[i].position.applyAxisAngle(new THREE.Vector3(-1, 0, 0), -0.160);
                        object.children[i].position.add(object.lever_pos);
                        object.children[i].rotateOnAxis(new THREE.Vector3(-1, 0, 0), -0.160);
                        object.pos_ctr = 0;
                    }
             }
        }

    }

    object.castShadow = true;
    object.receiveShadow = true;
}

export const loadWindscreenWiperLever = async () => {
    try {
        var myObject = await loadObject("models/windscreen_wiper_lever/racgrafikarocica3d.obj", "models/windscreen_wiper_lever/racgrafikarocica3d.mtl");
        init(myObject)
        console.log(myObject);
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}