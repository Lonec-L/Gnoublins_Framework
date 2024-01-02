import { loadObject } from '../utils/loadObject.mjs';
import * as THREE from 'three';


const init = async function (object) {
    object.position.y = -0.28;
    object.position.z = 0.51;
    object.position.x = 0.8;
    object.rotation.x = Math.PI / 2;
    object.rotation.y = Math.PI;
    object.scale.set(1.3, 1.3, 1.3);




    const video = document.createElement('video');

    // Access the webcam
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
        video.play();
        video.muted = true; // Mute to avoid feedback loop in audio
    } catch (e) {
        console.error('Error accessing the webcam:', e);
        return;
    }

    // Define the update function
    var canvas = document.createElement('canvas');
    object.update = function () {


        canvas.width = 640;
        canvas.height = 360;
        var context = canvas.getContext('2d');

        // Draw the video onto the canvas
        if (video.readyState >= video.HAVE_ENOUGH_DATA) {
            context.drawImage(video, 0, 0, 640, 360);
        }

        // Update the texture of the 3D object
        object.children[0].material.map = new THREE.CanvasTexture(canvas);
        object.children[0].material.map.needsUpdate = true;
    };

    // Continuously update the canvas with the video
    setInterval(() => object.update(), 1000 / 30); // Update at ~30 fps

    object.children[0].onClicked = function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        if (window.confirm("Do you want to download the webcam capture?")) {
            // Convert the canvas to an image (DataURL)
            const imageDataUrl = canvas.toDataURL('image/png');
    
            // Create an anchor element (<a>) for the download
            const downloadLink = document.createElement('a');
            downloadLink.href = imageDataUrl;
            downloadLink.download = 'webcam_capture.png';
    
            // Append the link to the document and trigger a click
            document.body.appendChild(downloadLink);
            downloadLink.click();
    
            // Clean up by removing the link after triggering the download
            document.body.removeChild(downloadLink);
        } else {
            console.log("Download cancelled by the user.");
        }
    }
};

    

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
loadDisplay('path/to/your/video.mp4');