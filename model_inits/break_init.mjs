import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.z = -1.75;
    object.position.y = -2.7;
    object.position.x = 0.8;

    object.rotation.y = -20.4;

    object.scale.set(2.75, 2.75, 2.5);
}

export const loadBreak = async () => {
    try {
        var myObject = await loadObject("models/break/break.obj", "models/break/break.mtl");
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}