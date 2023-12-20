import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.z = 0.33;
    object.position.y = -1.6;
    object.position.x = 0.3;

    object.rotation.y = -103.7;

    object.scale.set(1.75, 1.75, 1.75);
}

export const loadGasPedal = async () => {
    try {
        var myObject = await loadObject("models/gas_pedal/gas_pedal.obj", "models/gas_pedal/gas_pedal.mtl");
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}