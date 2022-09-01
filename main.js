import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

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
scene.background = new THREE.Color('orange');

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 35);
// camera.rotation.x = 1;
// camera.lookAt(0, 0, 0);
scene.add(camera);

// controls
// const controls = new OrbitControls( camera, renderer.domElement );

// light
const ambientLight = new THREE.AmbientLight('#fff', 0.5);
const spotLight = new THREE.SpotLight('#fff', 0.5);
spotLight.position.set(0, 10, 5);
scene.add(ambientLight, spotLight);

// mesh
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 'white',
});
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({
  color: 'plum'
});
let meshs = [];
const mesh1 = new THREE.Mesh(geometry, material);
const mesh2 = mesh1.clone();
const mesh3 = mesh1.clone();
const mesh4 = mesh1.clone();
const mesh5 = mesh1.clone();
mesh1.position.set(-5, 1, 20);
mesh2.position.set(7, 1, 10);
mesh3.position.set(-10, 1, 0);
mesh4.position.set(10, 1, -10);
mesh5.position.set(-5, 1, -20);
meshs.push( mesh1, mesh2, mesh3, mesh4, mesh5 );
scene.add( mesh1, mesh2, mesh3, mesh4, mesh5 );

// draw
const draw = function() {
  // controls.updatecontrols();

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}
draw();

// 
// console.log(meshs[0].position.x);
// console.log(meshs[1].position.x);
// console.log(meshs[2].position.x);
// console.log(meshs[3].position.x);
// console.log(meshs[4].position.x);
let currentSection = 1;
const setSection = function() {
  const newSection = Math.min(4, Math.round(window.scrollY / window.innerHeight));

  console.log(currentSection, newSection);

  if ( currentSection !== newSection ) {
    gsap.to(camera.position, {
      duration: 1,
      x: meshs[newSection].position.x,
      y: 2,
      z: meshs[newSection].position.z + 5,
    });
    currentSection = newSection;
  }
}

// 이벤트
window.addEventListener('scroll', setSection);

