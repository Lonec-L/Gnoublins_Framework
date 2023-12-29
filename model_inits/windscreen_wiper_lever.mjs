import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.z = 0.6;
    object.position.y = -0.62;
    object.position.x = 0.24;

    object.rotation.y = 1.5;

    object.scale.set(1.75, 1.75, 1.75);
}

export const loadWindscreenWiperLever = async () => {
    try {
        var myObject = await loadObject("models/windscreen_wiper_lever/racgrafikarocica3d.obj", "models/windscreen_wiper_lever/racgrafikarocica3d.mtl");
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}