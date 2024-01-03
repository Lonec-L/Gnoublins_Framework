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
            object.pointer_1_pos = new THREE.Vector3(0.198229, -0.045737, 0.086486);

            object.children[i].rot_value = 0;
            object.children[i].rot_max = 2.30;
            object.children[i].rot_min = -2.30;
            object.speed = 0;
            object.rpm = 0;
            object.children[i].target_rotation = 0 - 2.30;

            object.pointer_1 = function () {
                if (object.speed > 10 && object.speed < 131) {
                    object.children[i].target_rotation = ((object.speed - 10) / 130) * 4.60 - 2.30;
                }
                if (Math.abs(object.children[i].target_rotation - object.children[i].rotation.z) > 0.001) {
                    var rotateBy = (object.children[i].target_rotation - object.children[i].rotation.z) / 30;
                    object.children[i].position.sub(object.pointer_1_pos);
                    object.children[i].position.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotateBy);
                    object.children[i].position.add(object.pointer_1_pos);

                    object.children[i].rotateOnAxis(new THREE.Vector3(0, 0, 1), rotateBy);
                }
            }
        }
        else if (object.children[i].name === "lucka_gradbisce") {
            console.log(object.children[i].material.color)
            object.construction_site = function () {
                if (object.lights[0]) {
                    object.children[i].material.color.set(0xfcfc03);
                } else {
                    object.children[i].material.color.set(0x9b8177)
                }
            }
        }
        else if (object.children[i].name === "lucka_luknje_na_cesti") {
            object.holes_on_road = function () {
                if (object.lights[1]) {
                    object.children[i].material.color.set(0xfcfc03);
                }
                else {
                    object.children[i].material.color.set(0x9b8177)
                }
            }
        }
        else if (object.children[i].name === "lucka_sos") {

            object.sos = function () {
                if (object.lights[2]) {
                    object.children[i].material.color.set(0xff0000);
                } else {
                    object.children[i].material.color.set(0x9b8177)
                }
            }
        }
        else if (object.children[i].name === "kazalec_2") {
            object.pointer_2_pos = new THREE.Vector3(-0.198229, -0.045737, 0.086486);

            object.children[i].rot_value = 0;
            object.children[i].rot_max = Math.PI * 0.5;
            object.children[i].rot_min = -Math.PI;
            object.speed = 0;
            object.rpm = 0;
            object.children[i].target_rotation = 0 - 1 * Math.PI;

            object.pointer_2 = function () {
                if (object.rpm > 0 && object.rpm < 8000) {
                    object.children[i].target_rotation = ((object.rpm - 0) / 8000) * 1.45 * Math.PI - 1 * Math.PI;
                }
                if (Math.abs(object.children[i].target_rotation - object.children[i].rotation.z) > 0.001) {
                    var rotateBy = (object.children[i].target_rotation - object.children[i].rotation.z) / 30;
                    object.children[i].position.sub(object.pointer_2_pos);
                    object.children[i].position.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotateBy);
                    object.children[i].position.add(object.pointer_2_pos);

                    object.children[i].rotateOnAxis(new THREE.Vector3(0, 0, 1), rotateBy);
                }
            }
        }
    }

    object.update = function () {
        object.pointer_1()
        object.pointer_2()
        object.construction_site()
        object.holes_on_road()
        object.sos()
    }

    object.getData = function () {
        httpGetAsync("http://localhost:3011/data", function (response) {
            object.speed = JSON.parse(response).data[1];
            object.rpm = JSON.parse(response).data[3];
        });
        httpGetAsync("http://localhost:3011/dashboard_lights_data", function (response) {
            object.lights = JSON.parse(response).data;
        });
        object.dataTimeoutID = setTimeout(object.getData, 333);
    }
    object.getData();

    object.init = function () {
        object.dataTimeoutID = setTimeout(object.getData, 333);
    }

    object.deInit = function () {
        clearTimeout(object.dataTimeoutID);
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





