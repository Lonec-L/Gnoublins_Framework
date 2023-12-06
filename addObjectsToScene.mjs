import * as armaturka from './model_inits/armaturka_init.mjs';
import * as middle_storage from './model_inits/middle_storage_init.mjs';

export const addObjectsToScene = async (scene, gui) => {
    scene.add(await armaturka.loadArmaturka());
    //var mesh = await middle_storage.loadMiddleStorage()
    mesh.visible = false;
    scene.add(mesh);
    gui.add(mesh, 'visible').name(mesh.name || ('Mesh'));
}