import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.rotation.y = -Math.PI / 2;
    object.position.y = -2.6; // premik got dol
    object.position.z = -2.5; // premik naprej nazaj
    object.position.x = 0.83; // premik levo desno
    object.scale.set(2, 2, 1.6);

    // Find the child by name
    const windshieldChild = object.getObjectByName('Carosserie_.005');

    if (windshieldChild) {
        // Adjust transparency
        windshieldChild.material.transparent = true;
        windshieldChild.material.opacity = 0.5; // Adjust opacity as needed
    } else {
        console.warn("Child with name 'Carosserie_.005' not found.");
    }

        // Find the child by name
        const mirrorChild = object.getObjectByName('Mirror');

        if (mirrorChild) {
            // Adjust reflectiveness
            mirrorChild.material.envMap = /* Set your environment map here */ null; // You might need to provide an environment map
            mirrorChild.material.reflectivity = 0.8; // Adjust reflectivity as needed
        } else {
            console.warn("Child with name 'Mirror' not found.");
        }
    
}

export const loadShelby = async () => {
    try {
        var myObject = await loadObject("models/shelby/Shelby1.obj", "models/shelby/Shelby1.mtl");
        init(myObject)
        console.log("Shelby loaded");
        console.log(myObject);
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}