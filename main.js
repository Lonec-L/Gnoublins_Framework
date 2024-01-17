import * as THREE from "three";
import { addObjectsToScene } from "./addObjectsToScene.mjs";
import { GUI } from "dat.gui";
import { addEvent } from "./utils/addEvent.mjs";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const scene = new THREE.Scene();
var gui = new GUI();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraRotationSpeed = 0.007;
camera.rotate_x_animation = 0;
camera.rotate_y_animation = 0;
camera.position.z = 1.5;
camera.toggle = false;

var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

addObjectsToScene(scene, gui);

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

// const planeGeometry = new THREE.BoxGeometry(10, 0.1, 10);
// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.position.y = -1;
// plane.receiveShadow = true;

// scene.add(plane);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const textureLoader = new THREE.TextureLoader();

const textureFlare0 = textureLoader.load("textures/lensflare0.png");
const textureFlare3 = textureLoader.load("textures/lensflare3.png");

addLight(0.08, 0.8, 0.5, -12, 11, -10);


// panorama 
const panoSphereGeo = new THREE.SphereGeometry(200, 256, 256);

const panoSphereMat = new THREE.MeshStandardMaterial({
  side: THREE.BackSide,
  displacementScale: - 6.0
});

let sphere = new THREE.Mesh(panoSphereGeo, panoSphereMat);
sphere.rotation.y = 1.4;
sphere.rotation.x = 0.2;

const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);

loader.load('./textures/kandao5.jpg', function (texture) {

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  sphere.material.map = texture;

});

scene.add(sphere);

const bloomParams = {
  threshold: 0,
  strength: 0.3,
  radius: 0
};

const bloomFolder = gui.addFolder('Bloom Parameters');
bloomFolder.add(bloomParams, 'threshold', 0, 1).name('Threshold').onChange(updateBloom);
bloomFolder.add(bloomParams, 'strength', 0, 2).name('Strength').onChange(updateBloom);
bloomFolder.add(bloomParams, 'radius', 0, 1).name('Radius').onChange(updateBloom);
bloomFolder.open();

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);

function updateBloom() {
  bloomPass.threshold = bloomParams.threshold;
  bloomPass.strength = bloomParams.strength;
  bloomPass.radius = bloomParams.radius;
}

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

function addLight(h, s, l, x, y, z) {
  const light = new THREE.PointLight(0xffffff, 1.5, 2000, 0);
  light.color.setHSL(h, s, l);
  light.position.set(x, y, z);
  scene.add(light);

  const lensflare = new Lensflare();
  lensflare.addElement(new LensflareElement(textureFlare0, 600, 0, light.color));
  lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
  lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
  lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
  lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
  light.add(lensflare);
}

function onDocumentMouseDown(e) {
  e.preventDefault();
  // update the picking ray with the camera and pointer position

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

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
  //on the 15% edge of screen we move camera to the direction

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

document.addEventListener("mousemove", onDocumentMouseMove, false);
document.addEventListener("mousedown", onDocumentMouseDown, false);
document.addEventListener("mouseleave", function (event) {
  if (
    event.clientY <= 0 ||
    event.clientX <= 0 ||
    event.clientX >= window.innerWidth ||
    event.clientY >= window.innerHeight
  ) {
    camera.rotate_x_animation = 0;
    camera.rotate_y_animation = 0;
  }
});

addEvent(document, "keypress", function (e) {
  if (e.key == "c") {
    camera.toggle = !camera.toggle;
  } else if (e.key == "w") {
    camera.position.z -= 0.1;
  } else if (e.key == "s") {
    camera.position.z += 0.1;
  } else if (e.key == "a") {
    camera.position.x -= 0.1;
  } else if (e.key == "d") {
    camera.position.x += 0.1;
  }
});

function render(time) {
  time = (time / 1000) * 2.0;
  requestAnimationFrame(render);
  for (let i = 0; i < scene.children.length; i++) {
    if (scene.children[i].update) {
      scene.children[i].update();
    }
    if (scene.children[i].name == "spotlight") {
      scene.children[i].position.y = Math.sin(time);
    }
  }
  if (camera.toggle) {
    camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), camera.rotate_x_animation);
    camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), camera.rotate_y_animation);
  }
  //renderer.render(scene, camera);
  composer.render();
}
render();
