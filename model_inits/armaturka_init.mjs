import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { httpGetAsync } from '../utils/httpGetAsync.mjs';
import * as THREE from 'three';

const init = function (object) { // this function could be further split up into seperate functions (register update, register onClick...)
    object.rotation.y = Math.PI;
    object.position.z = 4;
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
            console.log(value);
        });
        setTimeout(object.getRandomSpeed, 1000);
    }
    object.getRandomSpeed();
}

const load = () => new Promise((resolve, reject) => {
    var mtlLoader = new MTLLoader();

    mtlLoader.load("models/armaturka/armaturka.mtl", function (materials) {

        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            'models/armaturka/armaturka.obj',
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

export const loadArmaturka = async () => {
    var armaturka = await load();
    init(armaturka)
    console.log(armaturka);
    return armaturka;
}





