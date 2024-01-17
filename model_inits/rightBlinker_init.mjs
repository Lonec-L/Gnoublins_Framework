import { loadObject } from '../utils/loadObject.mjs';
import { httpGetAsync } from '../utils/httpGetAsync.mjs';

const init = function (object) {
    object.position.z = 0.507;
    object.position.y = -0.39;
    object.position.x = 0.03;

    object.rotation.y = 3.15;

    object.rotation.x = 45.5;

    object.scale.set(1.25, 1.25, 2.5);

    object.getData = function () {
        httpGetAsync("http://localhost:8080/poll_data", function (response) {
            object.blinkers = response;
        });
        object.dataTimeoutID = setTimeout(object.getData, 1500);
        console.log(object.blinkers);

        object.children[0].material.color.setHex(0xffffff);

        if (object.blinkers == 2 || object.blinkers == 3) {
            object.children[0].material.color.setHex(0x00ff00);
        }
    }
    object.getData();

}

export const loadRightBlinker = async () => {
    try {
        var myObject = await loadObject("models/blinker/arrow.obj", "models/blinker/arrow.mtl");
        console.log(myObject);
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}
