import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.y = -1.5;
    object.position.z = 2;
    object.scale.set(0.8, 0.8, 0.5);
}

export const loadSeat = async () => {
    try {
        var myObject = await loadObject("models/seat/seat.obj", "models/seat/seat.mtl");
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}