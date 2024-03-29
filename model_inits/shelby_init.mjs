import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.rotation.y = -Math.PI / 2;
    object.position.y = -2.75; // premik got dol
    object.position.z = -2.5; // premik naprej nazaj
    object.position.x = 0.8; // premik levo desno
    object.scale.set(2, 2, 1.6);

    const windshieldChild = object.getObjectByName('Carosserie_.005');

    if (windshieldChild) {
        windshieldChild.material.transparent = true;
        windshieldChild.material.opacity = 0.5;
    } else {
        console.warn("Child with name 'Carosserie_.005' not found.");
    }

    const mirrorChild = object.getObjectByName('Circle.009');

    if (mirrorChild) {
        mirrorChild.material.envMap = null;
        mirrorChild.material.reflectivity = 0.8;
    } else {
        console.warn("Child with name 'Circle.009' not found.");
    }

    const windowChild = object.getObjectByName('Circle.010');

    if (windowChild) {
        windowChild.material.transparent = true;
        windowChild.material.opacity = 0.5;
    } else {
        console.warn("Child with name 'Circle.010' not found.");
    }

    const portesChild = object.getObjectByName('Portes');

    if (portesChild) {
        portesChild.material.envMap = null;
        portesChild.material.reflectivity = 0.8;
        portesChild.material.transparent = false;
    } else {
        console.warn("Child with name 'Portes' not found.");
    }
}

export const loadShelby = async () => {
    try {
        var myObject = await loadObject("models/shelby/Shelby1.obj", "models/shelby/Shelby1.mtl");
        init(myObject)
        myObject.renderOrder = 10;
        console.log("Shelby loaded");
        console.log(myObject);
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}