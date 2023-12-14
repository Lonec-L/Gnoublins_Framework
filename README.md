# Web_3D_Visualization

```
npm install
npx vite .
```

## Controls

Camera: - press `C` to toggle camera rotation. Dragging mouse near the edge of the screen rotates the camera around. - to move around the scene use `WASD` keys on your keyboard.

## How to add new objects?

1. In `/model_inits` add a new file (for example my_model_init.mjs).
2. In `/models` create you object folder and put in your obj, mtl and texture files. (See example `models/dashboard/`).
3. For just the import and display of the model put this code in:

```
import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.y = -0.5;
    object.position.z = 0;
    object.scale.set(0.5, 0.5, 0.5);
}

export const loadMyObject = async () => {
    try {
        var myObject = await loadObject("models/myObject/myObject.obj", "models/myObject/myObject.mtl");
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}
```

4. Now import and add `addObject(scene, gui, "Panel", loadPanel);` to `addObjectsToScene`.
5. Optionally you can declare methods on your object:
   - object.update() is called every frame
   - object.onClicked() is called when object is clicked on.
   - object.init() is called when object is added to scene via GUI.
   - object.deInit() is called when object is removed from scene
   - for keyboard events please use addEvent function from utils. Example is on line `105` in main.js
6. You can aso declare your own methods and callbacks to implement aditional functionality to your model (API calls, keyboardEvent callbacks...).
7. For omre examples look at already implemented objects and their init files.

8. You can send me tips and tricks to this paypal: https://paypal/rizzler
