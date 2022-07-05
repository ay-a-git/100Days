import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";
import image1 from "./public/image1.png";
import image2 from "./public/image2.png";

/**
 * Debug
 */
const gui = new dat.GUI({ closed: true, width: 400 });
console.log("press the H key to toggle the debugger");

//to hide the debugger from the browser
window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    if (gui._hidden) gui.show();
  } else {
    gui.hide();
  }
});

function spin() {}

let parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
    console.log("spin");
  },
  flip: () => {
    gsap.to(mesh.rotation, { duration: 1, x: mesh.rotation.x + Math.PI * 2 });
  },
};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
let loader = new THREE.TextureLoader();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: loader.load(image1) });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
mesh.position.set(-2, 0, 0);

/**
 * Object 2
 */
let loaderTwo = new THREE.TextureLoader();
const geometryTwo = new THREE.BoxGeometry(1, 1, 1);
const materialTwo = new THREE.MeshBasicMaterial({
  map: loaderTwo.load(image2),
});
const meshTwo = new THREE.Mesh(geometryTwo, materialTwo);
scene.add(meshTwo);
meshTwo.position.set(2, 0, 0);

// /**
//  * video object
//  */
// let video = document.getElementById("video");
// let videoTexture = new THREE.VideoTexture(video);

// const movieMaterial = new THREE.MeshBasicMaterial({
//   map: videoTexture,
//   //to play the footage only on the front of the cube
//   //side: THREE.FrontSide,
//   toneMapped: false,
// });

// const movieGeometry = new THREE.BoxGeometry(1, 1, 1);
// const movieMesh = new THREE.Mesh(movieGeometry, movieMaterial);
// scene.add(movieMesh);
// movieMesh.position.set(-1, -1, 0);

//Debugger for mesh
//the debugger can only be used on objects
//.add(object, name of object, min-val, max-val, 'step')
gui.add(mesh.position, "y", -3, 3, 0.01);
//we can also use a more specific syntax
gui.add(mesh.position, "x").min(-3).max(3).step(0.01).name("elevation");

gui.add(mesh, "visible");

gui.add(material, "wireframe");

gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
  console.log("tweaked the color");
});

gui.add(parameters, "spin");
gui.add(parameters, "flip");

gui.add(meshTwo.position, "y", -3, 3, 0.01).name("second mesh elevation");

//gui.add(mesh.BoxGeometry, "height");
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  meshTwo.rotation.y += 0.05;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
