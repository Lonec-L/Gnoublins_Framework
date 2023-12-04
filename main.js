import * as THREE from 'three';
import { addObjectsToScene } from './addObjectsToScene.mjs';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//here we add all our objects like this example
addObjectsToScene(scene);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1); //default; light shining from top
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



camera.position.z = 5;

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

document.addEventListener('mousedown', onDocumentMouseDown, false);

function render() {
    requestAnimationFrame(render);
    for (let i = 0; i < scene.children.length; i++) {
        if (scene.children[i].update) {
            scene.children[i].update();
        }
    }
    renderer.render(scene, camera);
}
render();