import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var mtlLoader = new MTLLoader();

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    } else {
        element["on" + eventName] = callback;
    }
}

mtlLoader.load("models/armaturka/armaturka.mtl", function (materials) {

    materials.preload();

    var objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(
        'models/armaturka/armaturka.obj',
        function (object) {

            object.getRandomSpeed = function () {
                httpGetAsync("http://www.randomnumberapi.com/api/v1.0/random?min=10&max=140&count=1", function (response) {
                    var value = JSON.parse(response)[0];
                    object.speed = value;
                    console.log(value);
                });
                setTimeout(object.getRandomSpeed, 1000);
            }
            object.getRandomSpeed();

            object.rotation.y = Math.PI;
            object.position.z = 4.5;
            console.log(object);
            for (let i = 0; i < object.children.length; i++) {
                if (object.children[i].name === "kazalec_1") {
                    //object.children[i].setPosition(0.198229, 0.086486, -0.045737);
                    //object.children[i].position = new THREE.Vector3(0.198229, 0.086486, -0.045737);
                    object.kazalec_1_pos = new THREE.Vector3(0.198229, -0.045737, 0.086486);

                    object.children[i].rot_value = 0;
                    object.children[i].rot_max = 2.30;
                    object.children[i].rot_min = -2.30;
                    object.speed = 0;
                    object.target_rotation = 0 - 2.30;

                    object.update = function () {
                        if (object.speed > 10 && object.speed < 140) {
                            object.target_rotation = ((object.speed - 10) / 130) * 4.60 - 2.30;
                        }
                        if (Math.abs(object.target_rotation - object.children[i].rotation.z) > 0.001) {
                            var rotateBy = (object.target_rotation - object.children[i].rotation.z) / 30;
                            object.children[i].position.sub(object.kazalec_1_pos);
                            object.children[i].position.applyAxisAngle(new THREE.Vector3(0, 0, 1), rotateBy);
                            object.children[i].position.add(object.kazalec_1_pos);

                            object.children[i].rotateOnAxis(new THREE.Vector3(0, 0, 1), rotateBy);
                        }
                    }
                }
                else if (object.children[i].name === "Lučka_gradbišče") {
                    object.children[i].onClicked = function () {
                        object.children[i].material.color.set(0xff0000);
                    }
                }
            }
            scene.add(object);

        }, function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    );

});

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 5); //default; light shining from top
light.castShadow = true; // default false
scene.add(light);

const alight = new THREE.AmbientLight(0x808080); // soft white light
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

const planeGeometry = new THREE.BoxGeometry(10, 0.1, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = -1;
plane.receiveShadow = true;

plane.onClicked = function () {
    this.material.color.set(0xff0000);
}

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

    if (intersects[0].object.onClicked)
        intersects[0].object.onClicked();
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