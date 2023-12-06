import { loadDashboard } from './model_inits/armaturka_init.mjs';
import { loadMiddleStorage } from './model_inits/middle_storage_init.mjs';

export const addObjectsToScene = async (scene, gui) => {
    var middle_storage = await loadMiddleStorage()
    middle_storage.visible = false;

    var dashboard = await loadDashboard();
    dashboard.visible = false;

    gui.add(middle_storage, 'visible').name("Middle storage").onFinishChange(async function (value) {
        if (!value) {
            middle_storage.deInit();
        } else {
            scene.add(middle_storage);
        }
    });
    gui.add(dashboard, 'visible').name("Dashboard").onFinishChange(async function (value) {
        if (!value) {
            dashboard.deInit();
        } else {
            scene.add(dashboard);
        }
    });
}