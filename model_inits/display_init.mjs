import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.y = -0.28;
    object.position.z = 0.51;
    object.position.x = 0.8;
    object.rotation.x = Math.PI / 2;
    object.rotation.y = Math.PI;
    object.scale.set(1.3, 1.3, 1.3);
}

export const loadDisplay = async () => {
    try {
        var myObject = await loadObject("models/display/display.obj", "models/display/display.mtl");
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}
