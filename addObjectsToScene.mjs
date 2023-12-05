import * as armaturka from './armaturka_init.mjs';
import * as middle_storage from './middle_storage_init.mjs';

export const addObjectsToScene = async (scene) => {
    //scene.add(await armaturka.loadArmaturka());
    scene.add(await middle_storage.loadMiddleStorage());
}