import * as THREE from 'three';
import { addObjectsToScene } from './addObjectsToScene.mjs';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraRotationSpeed = 0.007;
camera.rotate_x_animation = 0;
camera.rotate_y_animation = 0;
camera.position.z = 5;


var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

addObjectsToScene(scene);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 5); //default; light shining from top
light.castShadow = true; // default false
scene.add(light);

const alight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(alight);


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
//scene.add(cube);

cube.update = function () {
    this.rotation.x += 0.01;
    this.rotation.y += 0.01;
}

cube.onClicked = function () {
    this.material.color.set(0xff0000);
}

const planeGeometry = new THREE.BoxGeometry(4, 0.1, 4);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = -1;
plane.receiveShadow = true;

scene.add(plane);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();


function onDocumentMouseDown(e) {
    e.preventDefault();
    // update the picking ray with the camera and pointer position

    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    console.log(intersects);

    if (intersects.length > 0) {
        if (intersects[0].object.onClicked) {
            intersects[0].object.onClicked();
        }
    }
}

function onDocumentMouseMove(e) {
    console.log(e.x);
    console.log(e.y);

    if (e.x > 0.85 * width && e.x < width) {
        camera.rotate_x_animation = -cameraRotationSpeed;
    } else if (e.x < 0.15 * width && e.x > 0) {
        camera.rotate_x_animation = cameraRotationSpeed;
    } else {
        camera.rotate_x_animation = 0;
    }
    if (e.y > 0.85 * height) {
        camera.rotate_y_animation = -cameraRotationSpeed;
    } else if (e.y < 0.15 * height) {
        camera.rotate_y_animation = cameraRotationSpeed;
    } else {
        camera.rotate_y_animation = 0;
    }

}

document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseDown, false);

document.addEventListener("mouseleave", function (event) {

    if (event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight)) {

        camera.rotate_x_animation = 0;
        camera.rotate_y_animation = 0;
    }
});

function render() {
    requestAnimationFrame(render);
    for (let i = 0; i < scene.children.length; i++) {
        if (scene.children[i].update) {
            scene.children[i].update();
        }
    }
    camera.rotation.y += camera.rotate_x_animation;
    camera.rotation.x += camera.rotate_y_animation;
    renderer.render(scene, camera);
}
render();