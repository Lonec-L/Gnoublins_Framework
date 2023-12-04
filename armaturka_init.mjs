import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import * as THREE from 'three';

const init = function (object) { // this function could be further split up into seperate functions (register update, register onClick...)

    object.rotation.y = Math.PI;
    object.position.z = 4;
    console.log(object.children);
    for (let i = 0; i < object.children.length; i++) {
        if (object.children[i].name === "kazalec_1") {
            //object.children[i].setPosition(0.198229, 0.086486, -0.045737);
            //object.children[i].position = new THREE.Vector3(0.198229, 0.086486, -0.045737);
            object.kazalec_1_pos = new THREE.Vector3(0.198229, -0.045737, 0.086486);
            object.kazalec_1 = function () {
                object.children[i].position.sub(object.kazalec_1_pos);
                object.children[i].position.applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.01);
                object.children[i].position.add(object.kazalec_1_pos);
                object.children[i].rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.01);
            }

        }
        else if (object.children[i].name === "Lučka_gradbišče") {
            object.children[i].onClicked = function () {
                console.log(object.children[i] instanceof THREE.Mesh)
                object.children[i].material.color.set(0xff0000);
                console.log("Nekaj");
            }
        }
    }
    object.update = function () {
        object.kazalec_1()
    }
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





