import * as armaturka from './armaturka_init.mjs';

export const addObjectsToScene = async (scene) => {
    scene.add(await armaturka.loadArmaturka());
}