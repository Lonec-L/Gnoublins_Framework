import { httpGetAsync } from '../utils/httpGetAsync.mjs';
import { loadObject } from '../utils/loadObject.mjs';

const init = function (object) {
    object.position.y = -0.28;
    object.position.z = 0.51;
    object.position.x = 0.8;
    object.rotation.x = Math.PI / 2;
    object.rotation.y = Math.PI;
    object.scale.set(1.3, 1.3, 1.3);

    // Will update the texture
    object.update = function () {
        const apiUrl = 'http://localhost:3011/data';

        httpGetAsync(apiUrl, (response) => {
            var speed = JSON.parse(response).numbers[0];
            var rpm = JSON.parse(response).numbers[1];
            var speed_limit = JSON.parse(response).numbers[2];
        
            // TODO: Use actual values
        });
    }
}

export const loadDisplay = async () => {
    try {
        var myObject = await loadObject("models/display/display.obj", "models/display/display.mtl");
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}
