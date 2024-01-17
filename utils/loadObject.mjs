import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import * as THREE from "three";

export const loadObject = (objPath, mtlPath) => new Promise((resolve, reject) => {
    var mtlLoader = new MTLLoader();
    mtlLoader.setMaterialOptions({ side: THREE.DoubleSide });
    mtlLoader.load(mtlPath, function (materials) {
        materials.preload();
        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            objPath,
            function (object) {
                resolve(object);
            }, function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('An error happened');
                console.error(error);
                reject(error);
            }
        );

    });
});