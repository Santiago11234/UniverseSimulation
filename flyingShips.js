
import * as THREE from 'three';
import {OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import Planet from "./js/Planet.js";
import Rotation from "./js/Rotation.js"
import { GLTFLoader } from './three.js-master/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment} from './three.js-master/examples/jsm/environments/RoomEnvironment.js'

var isRotating = true;
var mooDImg= new Image();
mooDImg.src="images/moonDay.jpeg"
var earthImg = new Image();
earthImg.src="images/earth.jpeg"
var earthRotation = 0.002;
var shipSpeed = 0.005

//init all three.js create compononets

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer(
    {
        antialias: true
})
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );
const pmremGenerator = new THREE.PMREMGenerator( renderer );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;


//creates the earth
const earthgeometry = new THREE.SphereGeometry(2.5,25);
const earthmaterial = new THREE.MeshBasicMaterial( { 
    map: new THREE.TextureLoader().load(earthImg.src)
 } );
const earthMesh = new THREE.Mesh( earthgeometry, earthmaterial );
const earthSystem = new THREE.Group();
earthSystem.add(earthMesh);
scene.add(earthMesh);


//moon
const moon = new Planet(1, 50, mooDImg.src);
const moonMesh = moon.getMesh();
let moonSystem = new THREE.Group();
moonSystem.add(moonMesh);
scene.add(moonMesh);



earthSystem.add(moonSystem)


//what actually displays the images
new OrbitControls(camera, renderer.domElement);
camera.position.z = 10;


var gltf1;
var gltf2;
var gltf3;
var loader = new GLTFLoader()

loader.load('assets/space.glb', function(model) {
    //0.02
    model.scene.scale.set(0.065,0.065,0.065)
    gltf3 = model
    gltf3.scene.rotation.y = 2
    gltf3.scene.rotation.x = 2
    scene.add(gltf3.scene)
    runSec();
})



function runSec() {
    loader.load('assets/space.glb', function(model) {
        //0.02
        model.scene.scale.set(0.065,0.065,0.065)
        gltf2 = model
        gltf2.scene.rotation.x = 1
        scene.add(gltf2.scene)
        runlast()
    
    })
}



function runlast() {
    loader.load('assets/space.glb', function(model) {
        //0.02
        model.scene.scale.set(0.065,0.065,0.065)
        gltf1 = model
        gltf1.scene.rotation.z = -1.5; 
        scene.add(gltf1.scene)
    
        animate();
    })
    
}

const raycaster = new THREE.Raycaster();

var infoDiv = document.createElement("div");
infoDiv.style.position = "absolute";
infoDiv.style.backgroundColor = "white";
infoDiv.style.padding = "10px";
infoDiv.style.display = "none";
document.body.appendChild(infoDiv);

// Create a button within the div
var button = document.createElement("button");
button.innerHTML = "Click Me";
infoDiv.appendChild(button);

// Listen for mouse events on the canvas
renderer.domElement.addEventListener("mousemove", onMouseMove);

// Function to handle mouse events
function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates
  var mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster to point in the direction of the mouse
  raycaster.setFromCamera(mouse, camera);

  // Check if the raycaster intersects the spaceship
  var intersects = raycaster.intersectObjects([gltf1.scene, gltf2.scene]);

  // If the raycaster intersects the spaceship, update the position of the info div
  if (intersects.length > 0) {
    infoDiv.style.left = event.clientX + "px";
    infoDiv.style.top = event.clientY + "px";
    infoDiv.innerHTML = "santi is a god";
    infoDiv.style.display = "block";
    earthRotation = .0005
    shipSpeed = 0.0003
  } else {
    infoDiv.style.display = "none";
    earthRotation = 0.002
    shipSpeed = 0.005
  }
}





var t =0;
var angle = 0;

function animate() {
    if(isRotating === true) {
        angle += 0.01
         earthMesh.rotation.y += earthRotation
        
        gltf1.scene.position.x =  3*Math.cos(t) + 0;
        gltf1.scene.position.z =  3*Math.sin(t) + 0; 
        gltf1.scene.rotation.y -= shipSpeed
        
        gltf2.scene.position.y = 3*Math.cos(t+1) + 0;
        gltf2.scene.position.z = 3*Math.sin(t+1) + 0; 
        gltf2.scene.rotation.x += shipSpeed

        gltf3.scene.position.y = 5*Math.cos(t+2) + 0;
        gltf3.scene.position.z = 5*Math.sin(t+2) + 0; 
        gltf3.scene.position.x = 5*Math.sin(t+2) + 0; 
        gltf3.scene.rotation.y += shipSpeed
        gltf3.scene.rotation.z += shipSpeed
        gltf3.scene.rotation.x += shipSpeed
                
        t+= shipSpeed
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}