import { loadObject } from '../utils/loadObject.mjs';
import * as THREE from 'three';

const init = function (object) {

    object.position.z = 1.75;
    object.position.y = -1.15;
    object.position.x = 0.8;
    object.rotation.y = Math.PI;

    object.scale.set(1.5, 1.5, 1.5);

    for (let i = 0; i < object.children.length; i++) {
        if (object.children[i].name === "Lid") {
            object.lid_position_change = 0;
            object.lid_current_pos = 0;
            object.lid_pos = new THREE.Vector3(0, 0.02, -0.18);

            object.lid_change = function () {
                if (object.lid_current_pos <= 0 && object.lid_position_change < 0) {
                    object.lid_position_change = 0;
                }
                else if (object.lid_current_pos >= 1.5 && object.lid_position_change > 0) {
                    object.lid_position_change = 0;
                }
                else {
                    object.children[i].position.sub(object.lid_pos);
                    object.children[i].position.applyAxisAngle(new THREE.Vector3(-1, 0, 0), object.lid_position_change);
                    object.children[i].position.add(object.lid_pos);
                    object.children[i].rotateOnAxis(new THREE.Vector3(-1, 0, 0), object.lid_position_change);
                    object.lid_current_pos += object.lid_position_change;
                }
            }
        }
        if (object.children[i].name === "Button-open") {
            object.children[i].onClicked = function () {
                console.log("Here");
                object.lid_position_change = 0.025;
            }
        }
        else if (object.children[i].name === "Button-close") {
            object.children[i].onClicked = function () {
                object.lid_position_change = -0.025;
            }
        }
    }
    object.update = function () {
        if (object.lid_position_change != 0) {
            object.lid_change();
        }
    }
    object.castShadow = true;
    object.receiveShadow = true;
}

export const loadMiddleStorage = async () => {
    try {
        var storage = await loadObject("models/middle_storage/car_storage_part.obj", "models/middle_storage/car_storage_part.mtl");
        init(storage)
        //console.log(storage);
        return storage;
    } catch (e) {
        console.error(e);
    }
    return;
}