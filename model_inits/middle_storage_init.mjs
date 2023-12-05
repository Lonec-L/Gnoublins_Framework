import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import * as THREE from 'three';

const init = function (object) {

    object.position.z = 4;
    object.rotation.x = Math.PI / 2 + Math.PI / 6;
    object.rotation.y = Math.PI * 3 / 2;
    object.rotation.z = Math.PI / 2;

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

const load = () => new Promise((resolve, reject) => {
    var mtlLoader = new MTLLoader();

    mtlLoader.load("models/middle_storage/car_storage_part.mtl", function (materials) {

        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            'models/middle_storage/car_storage_part.obj',
            function (object) {

                resolve(object);

            }, function (xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function (error) {

                console.log('An error happened');
                console.error(error);

            }
        );

    });
});

export const loadMiddleStorage = async () => {
    var storage = await load();
    init(storage)
    console.log(storage);
    return storage;
}