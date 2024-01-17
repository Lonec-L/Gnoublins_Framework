import { httpGetAsync } from '../utils/httpGetAsync.mjs';
import * as THREE from 'three';

const createCanvasPlane = function () {
    const geometry = new THREE.PlaneGeometry(16 * 1.6, 9 * 1.6);

    const material = new THREE.MeshBasicMaterial({
        transparent: true,
        alphaTest: 0.5, // Adjust this value as needed
        map: createEmptyCanvasTexture()
    });

    const planeMesh = new THREE.Mesh(geometry, material);

    planeMesh.position.x = 3;
    planeMesh.position.y = 8;
    planeMesh.position.z = -10;
    planeMesh.scale.set(1.8, 1.8, 1.8);


    return planeMesh;
};

const createEmptyCanvasTexture = function () {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;

    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text on the canvas
    context.font = "60px Arial";
    context.fillStyle = "red";
    context.fillText("Loading...", 700, 560);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
};

const textureLoader = new THREE.TextureLoader();

const init = function (object) {
    object.redisSource = false;
    object.update = function () {
        if (object.loadTexture) {
            object.loadTexture = false;
            console.log("loading")
            textureLoader.load(object.image, function (texture) {
                object.material.map = texture;
                object.material.map.needsUpdate = true;
                object.image = undefined;
            });
        }
    }
    object.onClicked = function () {
        object.redisSource = !object.redisSource;
        if (object.redisSource) {
            object.position.y = 3;
        } else {
            object.position.y = 8;
        }
    }

    object.getData = function () {
        const timestamp = new Date().getTime();
        object.loadTexture = true;
        if (object.redisSource) {
            object.image = `http://localhost:3011/imageFromRedis?timestamp=${timestamp}`;
        } else {
            object.image = `http://localhost:3011/image`;
        }
        // if (neka spremenljivka) pol `http://localhost:3011/image?timestamp=${timestamp}` else `http://localhost:3011/imageFromRedis?timestamp=${timestamp}`
        setTimeout(object.getData, 100)
    }
    object.getData();

    object.init = function () {
        object.dataTimeoutID = setTimeout(object.getData, 33.3);
    }

    object.deInit = function () {
        clearTimeout(object.dataTimeoutID);
    }
}

export const loadSurroundings = async () => {
    try {
        var canvasPlane = createCanvasPlane();
        init(canvasPlane);
        return canvasPlane;
    } catch (e) {
        console.error(e);
    }
    return;
}
