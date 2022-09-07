import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


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





// mesh - floor
const floorNormalTex = textureLoader.load('/textures/floor_marble/Marble_Carrara_002_NORM.jpg');
const floorRoughnessTex = textureLoader.load('/textures/floor_marble/Marble_Carrara_002_ROUGH.jpg');
const floorAmbientTex = textureLoader.load('/textures/floor_marble/Marble_Carrara_002_OCC.jpg');
const floorBaseTex = textureLoader.load('/textures/floor_marble/Marble_Carrara_002_COLOR.jpg');
floorBaseTex.wrapS = THREE.RepeatWrapping;
floorBaseTex.wrapT = THREE.RepeatWrapping;
floorBaseTex.repeat.x = 10;
floorBaseTex.repeat.y = 10;
const floorMesh = new THREE.Mesh(
  new THREE.BoxGeometry(100, 100, 0.2),
  new THREE.MeshStandardMaterial({
    map: floorBaseTex,
    roughness: 0.5,
    metalness: 0.7,
    normalMap: floorNormalTex,
    roughnessMap: floorRoughnessTex,
    aoMap: floorAmbientTex,
    aoMapIntensity: 5,
  })
);
floorMesh.castShadow = true;
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);


// mesh - box
let meshs = [];
const mesh1 = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2), 
  new THREE.MeshStandardMaterial({
    // color: 'plum',
    map: meshTexture,
    roughness: 0.5,
    metalness: 0.7,
  })
);
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
  // lightHelper.update();

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}
draw();


const cameraScroll = function () {
  let cameraPoints = [];
  let cameraMoves;
  let cameraMovePoints;
  let lookPoints;
  let lookPointFirst;
  let lookMoves;
  let lookMovePoints;

  const init = function () {
    // camera
    for (let i = 0; i < meshsPoints.length; i++) {
      const point = new THREE.Vector3(meshsPoints[i].x, 5, meshsPoints[i].z + 15)
      cameraPoints.push(point);
    }
    cameraMoves = new THREE.CatmullRomCurve3(cameraPoints);
    cameraMovePoints = cameraMoves.getSpacedPoints(200);

    // look
    lookPoints = [
      new THREE.Vector3(-5, 1, 20),
      new THREE.Vector3(7, 1, 10),
      new THREE.Vector3(-10, 1, 0),
      new THREE.Vector3(10, 1, -10),
      new THREE.Vector3(-5, 1, -20),
    ];
    lookPointFirst = new THREE.Vector3(-5, 1, 20);
    lookMoves = new THREE.CatmullRomCurve3(lookPoints);
    lookMovePoints = lookMoves.getSpacedPoints(200);
  }


  const createRoute = function () {
    // camera move line
    const moveLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(cameraMovePoints),
      new THREE.LineBasicMaterial({ color: 'purple' })
    );
    scene.add(moveLine);


    // look line
    const lookLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(lookMovePoints),
      new THREE.LineBasicMaterial({ color: 'red' })
    );
    scene.add(lookLine);


    // look dot
    const sphereGeometry = new THREE.SphereBufferGeometry(0.5);
    const materialBlue = new THREE.MeshBasicMaterial( { color: 'blue' } );

    for (let i = 0; i < lookPoints.length; i++) {
      const moveHelper = new THREE.Mesh(sphereGeometry, materialBlue);

      moveHelper.position.copy(lookMoves.getPoint(i));
      moveHelper.position.y = 2;

      scene.add(moveHelper);
    }
  }


  const scroll = function () {
    let scrollTop = window.pageYOffset;
    let moveArea = container.offsetHeight - window.innerHeight;
    let percent = scrollTop / moveArea;

    let currentPoint = Math.round(percent * (cameraMovePoints.length - 1));
    let currentSection = Math.round(window.scrollY / window.innerHeight);

    // console.log(lookPoints)

    // lerp
    camera.position.lerp(cameraMovePoints[currentPoint], 0.05);
    lookPointFirst.lerp(lookPoints[currentSection], 0.05);
    camera.lookAt(lookPointFirst);


    // console.log(meshsPoints[0]);
    // console.log('camera-position', camera.position)
    // console.log('look-position', lookPointFirst, lookPoints[currentSection])
    window.requestAnimationFrame(scroll);
  }


  // event
  init();
  createRoute();
  scroll();
  // window.addEventListener('scroll', scroll);

}
cameraScroll();

