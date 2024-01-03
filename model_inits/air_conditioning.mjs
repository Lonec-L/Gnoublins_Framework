import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.y = -0.55;
    object.position.z = 0.44;
    object.position.x = 0.8;
    //object.rotation.x = Math.PI / 2;
    object.rotation.y = Math.PI;
    object.scale.set(1.9, 1.9, 1.9);
}

export const loadAirConditioning = async () => {
    try {
        var myObject = await loadObject("models/air_conditioning/air_conditioning.obj", "models/air_conditioning/air_conditioning.mtl");
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}