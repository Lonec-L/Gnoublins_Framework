import { loadDashboard } from './model_inits/dashboard_init.mjs';
import { loadMiddleStorage } from './model_inits/middle_storage_init.mjs';
import { loadPanel } from './model_inits/panel_init.mjs';

const addObject = async (scene, gui, objectName, loadFunction) => {
    var object = await loadFunction();
    if (object == undefined) {
        console.error("Object " + objectName + " is undefined");
        return;
    }
    object.visible = true;
    scene.add(object);
    gui.add(object, 'visible').name(objectName).onFinishChange(async function (value) {
        if (!value) {
            if (object.deInit) {
                object.deInit();
            }
            object.removeFromParent();
        } else {
            if (object.init) {
                object.init();
            }
            scene.add(object);
        }
    });

}

export const addObjectsToScene = async (scene, gui) => {
    addObject(scene, gui, "Dashboard", loadDashboard);
    addObject(scene, gui, "Middle storage", loadMiddleStorage);
    addObject(scene, gui, "Panel", loadPanel);
}