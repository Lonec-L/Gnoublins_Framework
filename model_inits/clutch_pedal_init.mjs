import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.z = -0.5;
    object.position.y = -2.7;
    object.position.x = -1;

    object.rotation.y = -20.4;

    object.scale.set(2.75, 2.75, 2.5);
}

export const loadClutchPedal = async () => {
    try {
        var myObject = await loadObject("models/clutch_pedal/sklopka.obj", "models/clutch_pedal/sklopka.mtl");
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}