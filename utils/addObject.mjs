
export const addObject = async (scene, gui, objectName, loadFunction) => {
    var object = await loadFunction();
    if (object == undefined) {
        console.error("Object " + objectName + " is undefined");
        return;
    }
    //object.visible = true;
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