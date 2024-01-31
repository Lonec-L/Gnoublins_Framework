import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.y = -0.5;
    object.position.z = 0;
    object.scale.set(0.5, 0.5, 0.5);
}

export const loadLeftHand = async () => {
    try {
        var leftHand = await loadObject("models/hands/leftHand.obj", "models/hands/leftHand.mtl");
        leftHand.name = "leftHand";
        init(leftHand)
        leftHand.visible = false;
        return leftHand;
    } catch (e) {
        console.error(e);
    }
    return;
}