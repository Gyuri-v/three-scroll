import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.querySelector('.canvas');

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;

// scene
const scene = new THREE.Scene;
scene.background = 'gray';

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 5);
camera.lookAt(0, 0, 0);
scene.add(camera);

// controls
const controls = new OrbitControls( camera, renderer.domElement );

// light
const ambientLight = new THREE.AmbientLight('#fff', 0.5);
const spotLight = new THREE.SpotLight('#fff', 0.5);
spotLight.position.set(0, 10, 5);
scene.add(ambientLight, spotLight);

// mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: 'plum'
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// draw
const draw = function() {
  controls.update();

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}
draw();

