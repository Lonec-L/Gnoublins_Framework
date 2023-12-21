import { loadObject } from "../utils/loadObject.mjs";

const init = function (object) {
  object.position.z = 1.1;
  object.position.y = -1.26;
  object.position.x = 0.99;

  object.rotation.y = -20.4;

  object.scale.set(1.5, 1.5, 1.5);
};

export const loadHandbrake = async () => {
  try {
    var myObject = await loadObject("models/handbrake/handbrake.obj", "models/handbrake/handbrake.mtl");
    init(myObject);
    return myObject;
  } catch (e) {
    console.error(e);
  }
  return;
};
