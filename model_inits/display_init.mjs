import { httpGetAsync } from "../utils/httpGetAsync.mjs";
import { loadObject } from "../utils/loadObject.mjs";
import { scene } from "../main.js";
import * as THREE from "three";

function getLeftHand() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(scene.getObjectByName("leftHand"));
    }, 2000);
  });
}
function getRightHand() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(scene.getObjectByName("rightHand"));
    }, 2000);
  });
}
const init = function (object) {
  object.position.y = -0.28;
  object.position.z = 0.51;
  object.position.x = 0.8;
  object.rotation.x = Math.PI / 2;
  object.rotation.y = Math.PI;
  object.scale.set(1.3, 1.3, 1.3);

  object.screens = ["SpeedLimit", "VoiceCommands", "DetectedRoadSigns", "CollisionDetection"];
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
  
  
  
  //YUGO variables
  var frame = new Image();
  frame.crossOrigin = "anonymous";
  var i = 0;

  var running = false;

  let izpis = "RADIO:OFF   AC:OFF   CONSUMPTION:7.9"; // Your variable
  let recording = "";
  
  var leftHand;
  getLeftHand().then((value) => {
    leftHand = value;
  });
  var rightHand;
  getRightHand().then((value) => {
    rightHand = value;
  });

  // webcam
  const video = document.createElement('video');
  video.autoplay = true;
  video.muted = true;

  var streamConstraints = {
    video: { width: 640, height: 360 },
};
navigator.mediaDevices
    .getUserMedia(streamConstraints)
    .then(gotStream)
    .catch(function (e) {
        alert("Could not access webcam!");
    });
    function gotStream(stream) {
    video.srcObject = stream;
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
      if (object.speed_limit > 6) {
        object.speed_limit -= 3;
      }
      context.fillText(object.voiceCommands[object.speed_limit], 20 + paddingX, 240 + paddingY);
    } else if (object.screens[object.screenIndex] == "DetectedRoadSigns") {
      const paddingX = 25;
      const paddingY = 50;
      context.fillText("Sign Detected:", 20 + paddingX, 80 + paddingY);
      context.putImageData(object.roadSignsAI[object.roadSignsID], 640 - 120 * 2 + paddingX, paddingY);

    } else if (object.screens[object.screenIndex] == "CollisionDetection") {
      const paddingX = 25;
      const paddingY = 50;
      context.fillText("Source Error", 20 + paddingX, 80 + paddingY);
      if(running){
        i++;
        frame.src = 'http://localhost:5000/get-image?n='+i;
        context.drawImage(frame, 0, 45, 640, 270);
      }else{
        if (video.readyState >= video.HAVE_ENOUGH_DATA) {
        context.drawImage(video, 0, 0, 640, 360);
      }
      if(leftHand.visible == false || rightHand.visible == false){
        if(leftHand.visible == false){
          context.font = "bold 48px Arial";
          context.fillStyle = "red";
          context.fillText("Left", 10, 50,610);
        }else{
          context.font = "bold 48px Arial";
          context.fillStyle = "green";
          context.fillText("Left", 10, 50,610);
        }
        if(rightHand.visible == false){
          context.font = "bold 48px Arial";
          context.fillStyle = "red";
          context.fillText("Right", 505, 50,610);
        }else{
          context.font = "bold 48px Arial";
          context.fillStyle = "green";
          context.fillText("Right", 505, 50,610);
        }
      }
      else {
          running = true;
          if (window.confirm("Do you want to download the webcam capture?")) {
            const imageDataUrl = canvas.toDataURL('image/png');
    
            const downloadLink = document.createElement('a');
            downloadLink.href = imageDataUrl;
            downloadLink.download = 'webcam_capture.png';
    
            document.body.appendChild(downloadLink);
            downloadLink.click();
    
            document.body.removeChild(downloadLink);
          }else {
            console.log("Download cancelled by the user.");
            const imageDataUrl = canvas.toDataURL('image/png');

            if (window.confirm("Do you want to upload to server?")) {
              fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Origin': 'localhost',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({ 'image': imageDataUrl }),
            })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));
            }
            fetch('http://127.0.0.1:5000/get_result', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': "*"
              },
            })
            .then(response => response.json())
            .then(data => {
              if (data.detection == 'nemanja' || data.detection == 'dejan') {
                console.log('Welcome ' + data.detection + '!');
              } 
              else {
                console.log('Intruder alert!');
              }
            })
            .catch(error => console.error('Error:', error));
      }
    }
      context.font = "bold 30px Arial";
      context.fillStyle = "black";
      // context.fillText(izpis, 10, 40,610);
      // context.fillText(recording, 10, 80,610);
      }
    }

    object.children[0].material.map = new THREE.CanvasTexture(canvas);
    object.children[0].material.map.needsUpdate = true;
  };
  setInterval(() => object.update(), 1000 / 30);

  object.getData = function () {
    httpGetAsync("http://localhost:3011/data", function (response) {
      object.speed_limit = JSON.parse(response).data[0];
      object.speed = JSON.parse(response).data[1];
      object.driver_score = JSON.parse(response).data[2];
      object.rpm = JSON.parse(response).data[3];
      object.roadSignsID = JSON.parse(response).data[5];
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

export function updateIzpis(newText, recording1) {
  if(newText != "") {
  izpis = newText;
  }
  recording = recording1;
}