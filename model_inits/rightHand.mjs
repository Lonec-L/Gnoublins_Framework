import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.y = -0.5;
    object.position.z = 0;
    object.scale.set(0.5, 0.5, 0.5);
}

export const loadRightHand = async () => {
    try {
        var rightHand = await loadObject("models/hands/rightHand.obj", "models/hands/rightHand.mtl");
        rightHand.name = "rightHand";
        init(rightHand)
        rightHand.visible = false;
        return rightHand;
    } catch (e) {
        console.error(e);
    }
    return;
}