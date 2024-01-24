import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.y = -0.5;
    object.position.z = 0;
    object.scale.set(0.5, 0.5, 0.5);
}

export const loadPanel = async () => {
    try {
        var panel = await loadObject("models/panel/smooth_panel.obj", "models/panel/smooth_panel.mtl");
        init(panel)
        return panel;
    } catch (e) {
        console.error(e);
    }
    return;
}