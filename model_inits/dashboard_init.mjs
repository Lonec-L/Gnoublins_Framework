import { loadObject } from '../utils/loadObject.mjs';
import { httpGetAsync } from '../utils/httpGetAsync.mjs';
import * as THREE from 'three';

const init = function (object) { // this function could be further split up into seperate functions (register update, register onClick...)
    object.rotation.y = Math.PI;
    object.position.z = 0.4;
    object.position.y = -0.265;
    console.log(object.children);
    for (let i = 0; i < object.children.length; i++) {
        if (object.children[i].name === "kazalec_1") {
            object.kazalec_1_pos = new THREE.Vector3(0.198229, -0.045737, 0.086486);

            object.children[i].rot_value = 0;
            object.children[i].rot_max = 2.30;
            object.children[i].rot_min = -2.30;
            object.speed = 0;
            object.target_rotation = 0 - 2.30;

            object.kazalec_1 = function () {
                if (object.speed > 10 && object.speed < 140) {
                    object.target_rotation = ((object.speed - 10) / 130) * 4.60 - 2.30;
                }
                if (Math.abs(object.target_rotation - object.children[i].rotation.z) > 0.001) {
                    var rotateBy = (object.target_rotation - object.children[i].rotation.z) / 30;
                    object.children[i].position.sub(object.kazalec_1_pos);
                    object.children[i].position.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotateBy);
                    object.children[i].position.add(object.kazalec_1_pos);

                    object.children[i].rotateOnAxis(new THREE.Vector3(0, 0, 1), rotateBy);
                }
            }
        }
        else if (object.children[i].name === "Lučka_gradbišče") {
            object.children[i].onClicked = function () {
                object.children[i].material.color.set(0xff0000);
            }
        }
    }
    object.update = function () {
        object.kazalec_1()
    }

    object.getRandomSpeed = function () {
        httpGetAsync("http://www.randomnumberapi.com/api/v1.0/random?min=10&max=140&count=1", function (response) {
            var value = JSON.parse(response)[0];
            object.speed = value;
            console.log("Speed from server: " + value);
        });
        object.randomSpeedTimeoutID = setTimeout(object.getRandomSpeed, 1000);
    }
    object.getRandomSpeed();

    object.init = function () {
        object.randomSpeedTimeoutID = setTimeout(object.getRandomSpeed, 1000);
    }

    object.deInit = function () {
        clearTimeout(object.randomSpeedTimeoutID);
    }
}

export const loadDashboard = async () => {
    try {
        var dashboard = await loadObject("models/dashboard/armaturka.obj", "models/dashboard/armaturka.mtl");
        init(dashboard)
        console.log(dashboard);
        return dashboard;
    } catch (e) {
        console.error(e);
    }
    return;
}





