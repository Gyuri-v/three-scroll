import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { Vector2, Vector3 } from 'three';


const container = document.querySelector('.container');
const sections = document.querySelectorAll('.section');
const canvas = document.querySelector('.canvas');


const meshsPoints = [
  new THREE.Vector3(-5, 1, 20),
  new THREE.Vector3(7, 1, 10),
  new THREE.Vector3(-10, 1, 0),
  new THREE.Vector3(10, 1, -10),
  new THREE.Vector3(-5, 1, -20),
];

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;

// scene
const scene = new THREE.Scene;
scene.background = new THREE.Color('black');




// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(meshsPoints[0].x, 10, meshsPoints[0].z + 20);
camera.lookAt(meshsPoints[0].x, meshsPoints[0].y, meshsPoints[0].z);
scene.add(camera);




// light
const ambientLight = new THREE.AmbientLight('#fff', 1);
const directionalLight = new THREE.DirectionalLight('#fff', 1);
// const spotLight = new THREE.SpotLight('#fff', 10);
// spotLight.position.set(0, 20, 35);
// spotLight.angle = Math.PI / 6;
// spotLight.penumbra = 1;
// spotLight.decay = 2;
// spotLight.distance = 100;

// spotLight.castShadow = true;
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;
// spotLight.shadow.camera.near = 10;
// spotLight.shadow.camera.far = 200;
// spotLight.shadow.focus = 1;

scene.add(ambientLight, directionalLight);




// controls
// const controls = new OrbitControls( camera, renderer.domElement );

// loader
const textureLoader = new THREE.TextureLoader();
const meshTexture = textureLoader.load('/textures/floor_marble/Marble_Carrara_002_COLOR.jpg');

// helper
// const lightHelper = new THREE.SpotLightHelper( spotLight, 5 );
// const cameraHelper = new THREE.CameraHelper( camera )
// scene.add( lightHelper, cameraHelper );




// mesh
// mesh - floor
const floorBaseTex = textureLoader.load('/textures/floor_marble/Marble_Carrara_002_COLOR.jpg');
floorBaseTex.wrapS = THREE.RepeatWrapping;
floorBaseTex.wrapT = THREE.RepeatWrapping;
floorBaseTex.repeat.x = 10;
floorBaseTex.repeat.y = 10;
const floorNormalTex = textureLoader.load('/textures/floor_marble/Marble_Carrara_002_NORM.jpg');
const floorRoughnessTex = textureLoader.load('/textures/floor_marble/Marble_Carrara_002_ROUGH.jpg');
const floorAmbientTex = textureLoader.load('/textures/floor_marble/Marble_Carrara_002_OCC.jpg');
const floorGeometry = new THREE.BoxGeometry(100, 100, 0.2);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorBaseTex,
  roughness: 0.5,
  metalness: 0.7,
  normalMap: floorNormalTex,
  roughnessMap: floorRoughnessTex,
  aoMap: floorAmbientTex,
  aoMapIntensity: 5,
});
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.castShadow = true;
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);


// mesh - box


const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({
  // color: 'plum',
  map: meshTexture,
  roughness: 0.5,
  metalness: 0.7,
});
let meshs = [];
const mesh1 = new THREE.Mesh(geometry, material);
mesh1.castShadow = true;
mesh1.receiveShadow = true;
const mesh2 = mesh1.clone();
const mesh3 = mesh1.clone();
const mesh4 = mesh1.clone();
const mesh5 = mesh1.clone();

mesh1.position.set(meshsPoints[0].x, meshsPoints[0].y, meshsPoints[0].z);
mesh2.position.set(meshsPoints[1].x, meshsPoints[1].y, meshsPoints[1].z);
mesh3.position.set(meshsPoints[2].x, meshsPoints[2].y, meshsPoints[2].z);
mesh4.position.set(meshsPoints[3].x, meshsPoints[3].y, meshsPoints[3].z);
mesh5.position.set(meshsPoints[4].x, meshsPoints[4].y, meshsPoints[4].z);
meshs.push( mesh1, mesh2, mesh3, mesh4, mesh5 );
scene.add( mesh1, mesh2, mesh3, mesh4, mesh5 );



// draw
const draw = function() {
  // controls.update();

  // spotLight.position.set(camera.position.x, camera.position.y, camera.position.z);
  // spotLight.lookAt(camera.position.x, 0, camera.position.z + 5);

  // console.log(camera.position.x, 0, camera.position.z)

  // lightHelper.update();

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}
draw();


// let currentSection = 1;
// const setSection = function() {
//   const newSection = Math.min(4, Math.round(window.scrollY / window.innerHeight));

//   if ( currentSection !== newSection ) {

//     gsap.to(camera.position, {
//       duration: 1,
//       x: meshs[newSection].position.x,
//       y: 2,
//       z: meshs[newSection].position.z + 5,
//     });
//     currentSection = newSection;
//   }
// }

// // 이벤트
// window.addEventListener('scroll', setSection);






const cameraScroll = function () {

  let meshMoves;
  let movePoints;

  const createRoute = function () {
    meshMoves = new THREE.CatmullRomCurve3(meshsPoints);
    movePoints = meshMoves.getSpacedPoints(200);

    const moveLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(movePoints),
      new THREE.LineBasicMaterial({ color: 'red' })
    );
    scene.add(moveLine);

    const sphereGeometry = new THREE.SphereBufferGeometry(0.05);
    const materialRed = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const materialBlue = new THREE.MeshBasicMaterial( { color: 'blue' } );


    // const moveSpots = meshMoves.getPoint(meshsPoints.length - 1);
    // console.log(meshMoves.getPoint(0));
    for (let i = 0; i < meshsPoints.length; i++) {
      const moveHelper = new THREE.Mesh(sphereGeometry, materialBlue);

      moveHelper.position.copy(meshMoves.getPoint(i));
      moveHelper.position.y = 3;

      scene.add(moveHelper);
    }
  }

  let currentSection = 0;
  const scroll = function () {
    let scrollTop = window.pageYOffset;
    let moveArea = container.offsetHeight - window.innerHeight;
    let percent = scrollTop / moveArea;
    let currentPoint = Math.round(percent * (movePoints.length - 1));
    let currentSection = Math.round(percent * (sections.length - 1));
    // let newSection = Math.round(percent * (sections.length - 1));
    // console.log(currentSection, newSection);

    camera.position.lerpVectors(camera.position, new THREE.Vector3(movePoints[currentPoint].x, 5, movePoints[currentPoint].z + 15), 0.05);

    const lookPoint = meshsPoints[0];
    lookPoint.lerpVectors(lookPoint, meshsPoints[currentSection], 0.05);
    camera.lookAt(lookPoint);


    console.log(meshsPoints[currentSection], lookPoint);

    
    // camera.lookAt(meshsPoints[currentSection].x, meshsPoints[currentSection].y, meshsPoints[currentSection].z );



    // camera.position.set(movePoints[currentPoint].x, 10, movePoints[currentPoint].z + 20);
    // camera.lookAt(meshsPoints[currentSection].x, meshsPoints[currentSection].y, meshsPoints[currentSection].z );
    // if ( currentSection !== newSection ) {

    //   camera.lookAt(meshsPoints[newSection].x, meshsPoints[newSection].y, meshsPoints[newSection].z );
    //   currentSection = newSection;
    // }

  }


  createRoute();
  window.addEventListener('scroll', scroll);

}
cameraScroll();

