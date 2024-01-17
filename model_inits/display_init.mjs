import { httpGetAsync } from "../utils/httpGetAsync.mjs";
import { loadObject } from "../utils/loadObject.mjs";
import * as THREE from "three";

const init = function (object) {
  object.position.y = -0.28;
  object.position.z = 0.51;
  object.position.x = 0.8;
  object.rotation.x = Math.PI / 2;
  object.rotation.y = Math.PI;
  object.scale.set(1.3, 1.3, 1.3);

  object.screens = ["SpeedLimit", "VoiceCommands", "DetectedRoadSigns"];
  object.screenIndex = 0;
  object.roadSigns = [];
  object.voiceCommands = ["Pause", "Skip", "Continue", "Play Song", "Mute", "Louder", "Quieter"];
  object.roadSignsAI = [];

  // Load an image
  const image = new Image();
  image.src = "models/display/road_signs/road_signs.jpg";

  // Load signs from the image
  image.onload = function () {
    const scaleFactor = 4;

    // Take from part of the image
    const canvas = document.createElement("canvas");
    canvas.width = image.width * scaleFactor;
    canvas.height = image.height * scaleFactor;
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.scale(scaleFactor, scaleFactor);
    context.drawImage(image, 0, 0);

    object.roadSigns.push(context.getImageData(8 * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor));
    object.roadSigns.push(context.getImageData(8 * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor));
    object.roadSigns.push(
      context.getImageData((8 + 65) * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor)
    );
    object.roadSigns.push(
      context.getImageData((8 + 97) * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor)
    );
    object.roadSigns.push(
      context.getImageData((8 + 129) * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor)
    );
    object.roadSigns.push(
      context.getImageData((8 + 161) * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor)
    );
    object.roadSigns.push(context.getImageData(8 * scaleFactor, 228 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor));
    object.roadSigns.push(
      context.getImageData((8 + 226) * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor)
    );
    object.roadSigns.push(
      context.getImageData((8 + 258.5) * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor)
    );
    object.roadSigns.push(context.getImageData(8 * scaleFactor, 228 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor));
    object.roadSigns.push(
      context.getImageData((8 + 32) * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor)
    );

    object.roadSignsAI.push(context.getImageData((8) * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor));//30
    object.roadSignsAI.push(context.getImageData((8 + 32) * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor));//40
    object.roadSignsAI.push(context.getImageData((8 + 129) * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor));//70
    object.roadSignsAI.push(context.getImageData((8 + 161) * scaleFactor, 194 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor));//80
    object.roadSignsAI.push(context.getImageData((5) * scaleFactor, 158 * scaleFactor, 35 * scaleFactor, 35 * scaleFactor));//give away
    object.roadSignsAI.push(context.getImageData((8 + 257) * scaleFactor, 123 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor));//no turn left
    object.roadSignsAI.push(context.getImageData((8 + 289) * scaleFactor, 123 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor));//no turn right
    object.roadSignsAI.push(context.getImageData((8 + 161) * scaleFactor, 298 * scaleFactor, 33 * scaleFactor, 33 * scaleFactor));//priority road


  };

  //Change display screen when clicked
  for (let i = 0; i < object.children.length; i++) {
    if (object.children[i].name === "Cube_Cube_Screen_Material") {
      object.children[i].onClicked = function () {
        object.screenIndex++;
        if (object.screenIndex == object.screens.length) {
          object.screenIndex = 0;
        }
      };
    }
  }

  // Will update the texture
  object.update = function () {
    var canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    var context = canvas.getContext("2d");
    context.font = "60px Arial";
    context.fillStyle = "white";

    if (object.screens[object.screenIndex] == "SpeedLimit") {
      if (object.roadSigns.length < 11) {
        return;
      }

      const paddingX = 25;
      const paddingY = 50;

      context.fillText("Speed Limit", 20 + paddingX, 80 + paddingY);
      context.putImageData(object.roadSigns[object.speed_limit], 640 - 120 * 2 + paddingX, paddingY);
      context.fillText("Driver score: " + object.driver_score + "/100", 20 + paddingX, 240 + paddingY);
    } else if (object.screens[object.screenIndex] == "VoiceCommands") {
      const paddingX = 25;
      const paddingY = 50;
      context.fillText("Voice command:", 20 + paddingX, 80 + paddingY);
      context.fillText(object.voiceCommands[object.voiceCommandID], 20 + paddingX, 240 + paddingY);
    } else if (object.screens[object.screenIndex] == "DetectedRoadSigns") {
      const paddingX = 25;
      const paddingY = 50;
      context.fillText("Sign Detected:", 20 + paddingX, 80 + paddingY);
      context.putImageData(object.roadSignsAI[object.roadSignsID], 640 - 120 * 2 + paddingX, paddingY);

    }

    object.children[0].material.map = new THREE.CanvasTexture(canvas);
    object.children[0].material.map.needsUpdate = true;
  };

  object.getData = function () {
    httpGetAsync("http://localhost:3011/data", function (response) {
      object.speed_limit = JSON.parse(response).data[0];
      object.speed = JSON.parse(response).data[1];
      object.driver_score = JSON.parse(response).data[2];
      object.rpm = JSON.parse(response).data[3];
      object.roadSignsID = JSON.parse(response).data[5];
      object.voiceCommandID = JSON.parse(response).data[6];
    });
    object.dataTimeoutID = setTimeout(object.getData, 333);
  };
  object.getData();

  object.init = function () {
    object.dataTimeoutID = setTimeout(object.getData, 333);
  };

  object.deInit = function () {
    clearTimeout(object.dataTimeoutID);
  };
};

export const loadDisplay = async () => {
  try {
    var myObject = await loadObject("models/display/display.obj", "models/display/display.mtl");
    init(myObject);
    return myObject;
  } catch (e) {
    console.error(e);
  }
  return;
};
