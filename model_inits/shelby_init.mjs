import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.rotation.y = -Math.PI / 2;
    object.position.y = -2.6; // premik got dol
    object.position.z = -2.5; // premik naprej nazaj
    object.position.x = 0.83; // premik levo desno
    object.scale.set(2, 2, 1.6);
}

export const loadShelby = async () => {
    try {
        var myObject = await loadObject("models/shelby/Shelby1.obj", "models/shelby/Shelby1.mtl");
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}