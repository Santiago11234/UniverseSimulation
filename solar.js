import * as THREE from "three";
import {OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import Planet from "./Planet.js";
import Rotation from "./Rotation.js"
import Ring from "./Ring.js";


//set up stuff

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer(
    {
        antialias: true
})
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

//planet generation

var sunImg = new Image();
sunImg.src="sun.jpeg"
console.log(sunImg)
const geometrySun = new THREE.SphereGeometry(8);
const materialSun = new THREE.MeshBasicMaterial( { 
    map: new THREE.TextureLoader().load(sunImg.src)
} );
const sunMesh = new THREE.Mesh( geometrySun, materialSun );
const solarSystem = new THREE.Group();
solarSystem.add(sunMesh);
scene.add( sunMesh );
    

var merImg = new Image();
merImg.src="mercury.png"
const mercury = new Planet(2, 16, merImg.src);
const mercuryMesh = mercury.getMesh();
let mercurySystem = new THREE.Group();
mercurySystem.add(mercuryMesh);
scene.add(mercuryMesh);


var venImg = new Image();
venImg.src="venus.jpeg"
const venus = new Planet(3, 32, venImg.src);
const venusMesh = venus.getMesh();
let venusSystem = new THREE.Group();
venusSystem.add(venusMesh);
scene.add(venusMesh);

var earthImg = new Image();
earthImg.src="earth.jpeg"
const earth = new Planet(4, 48, earthImg.src);
const earthMesh = earth.getMesh();
const earthSystem = new THREE.Group();
earthSystem.add(earthMesh);
scene.add(earthMesh);

var mooImg = new Image();
mooImg.src="moonDay.jpeg"
const moon = new Planet(1, 50, mooImg.src);
const moonMesh = moon.getMesh();
let moonSystem = new THREE.Group();
moonSystem.add(moonMesh);
scene.add(moonMesh);

var marImg = new Image();
marImg.src="mars.jpeg"
const mars = new Planet(3, 64, marImg.src);
const marsMesh = mars.getMesh();
let marsSystem = new THREE.Group();
marsSystem.add(marsMesh);
scene.add(marsMesh);

earthSystem.add(moonSystem)
solarSystem.add(mercurySystem, venusSystem, earthSystem, marsSystem);

const mercuryRotation = new Rotation(mercuryMesh);
const mercuryRotationMesh = mercuryRotation.getMesh();
mercurySystem.add(mercuryRotationMesh);

const venusRotation = new Rotation(venusMesh);
const venusRotationMesh = venusRotation.getMesh();
venusSystem.add(venusRotationMesh);

const earthRotation = new Rotation(earthMesh);
const earthRotationMesh = earthRotation.getMesh();
earthSystem.add(earthRotationMesh);

const marsRotation = new Rotation(marsMesh);
const marsRotationMesh = marsRotation.getMesh();
marsSystem.add(marsRotationMesh);

const moonRotation = new Rotation(moonMesh)
const moonRotationMesh = moonRotation.getMesh();
moonSystem.add(moonRotationMesh)

//rings

const mercRing= new Ring(20, 20.5)
const r1Mesh= mercRing.getMesh();
scene.add(r1Mesh)

const venRing= new Ring(30, 30.5)
const r2Mesh= venRing.getMesh();
scene.add(r2Mesh)

const earthRing= new Ring(40, 40.5)
const r3Mesh= earthRing.getMesh();
scene.add(r3Mesh)

const marsRing= new Ring(50, 50.5)
const r4Mesh= marsRing.getMesh();
scene.add(r4Mesh)

const moonRing = new Ring(5,5.5)
const r11Mesh = moonRing.getMesh()
scene.add(r11Mesh)

//stars
const starGeo = new THREE.BufferGeometry()
const vertices = [];

for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 800 - 300;
    const y = Math.random() * 800 - 300;
    const z = Math.random() * 800 - 300;
    vertices.push(x, y, z);
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));



let sprite = new THREE.TextureLoader().load( 'https://as1.ftcdn.net/v2/jpg/03/38/57/74/1000_F_338577456_LQ7TWBZwHauygltRwEfZczYTdhFEKl5V.jpg' );
let starMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.7,
  map: sprite
});

const stars = new THREE.Points(starGeo,starMaterial);
scene.add(stars);



//gui editor stuff

const gui = new dat.GUI();
    var planets = {
       Sun: true, 
       Mercury: true,
       Venus: true,
       Earth: true,
       Mars: true,
       Moon: true  
    }      
gui.add(planets, 'Sun').onChange(function (value) {
    sunMesh.visible = !sunMesh.visible  
}); 
gui.add(planets, 'Mercury').onChange(function (value) {
    mercuryMesh.visible = !mercuryMesh.visible
    r1Mesh.visible = !r1Mesh.visible
  }); 
  gui.add(planets, 'Venus').onChange(function (value) {
    venusMesh.visible = !venusMesh.visible
    r2Mesh.visible = !r2Mesh.visible
  }); 
  gui.add(planets, 'Earth').onChange(function (value) {
    earthMesh.visible = !earthMesh.visible
    r3Mesh.visible = !r3Mesh.visible
  }); 
  gui.add(planets, 'Mars').onChange(function (value) {
    marsMesh.visible = !marsMesh.visible
    r4Mesh.visible = !r4Mesh.visible
  }); 
  gui.add(planets, 'Moon').onChange(function (value) {
    moonMesh.visible = !moonMesh.visible
    r11Mesh.visible = !r11Mesh.visible
  }); 



//what actually displays the images
new OrbitControls(camera, renderer.domElement);
camera.position.z = 100;
camera.position.y = 30;
camera.rotation.x = -0.4

scene.add(camera);
var t =0

function animate() {
   
    t += 0.01;     
    sunMesh.rotation.y += 0.01


    mercuryMesh.rotation.y += 0.01
    mercuryMesh.position.x = 20*Math.cos(t) + 0;
    mercuryMesh.position.z = 20*Math.sin(t) + 0; 

    venusMesh.rotation.y += 0.01
    venusMesh.position.x = 30*Math.cos(35.02/47.87*t) + 0;
    venusMesh.position.z = 30*Math.sin(35.02/47.87*t) + 0; 

    earthMesh.rotation.y += 0.01
    earthMesh.position.x = 40*Math.cos(29.87/47.87*t) + 0;
    earthMesh.position.z = 40*Math.sin(29.87/47.87*t) + 0; 

    

    marsMesh.rotation.y += 0.01
    marsMesh.position.x = 50*Math.cos(24.077/47.87*t) + 0;
    marsMesh.position.z = 50*Math.sin(24.077/47.87*t) + 0; 

    moonMesh.rotation.y += 0.01
    moonMesh.position.x = earthMesh.position.x + 5*Math.cos(t) + 0;
    moonMesh.position.z = earthMesh.position.z + 5*Math.sin(t) + 0; 

    r11Mesh.position.x = earthMesh.position.x ;
    r11Mesh.position.z = earthMesh.position.z; 


    const array = starGeo.attributes.position.array
    
    for(let i = 0; i < array.length; i+=6){

        array[i] +=  +0.1
        array[i+2] += +.01
        array[i+3] -=  0.1
        array[i+4] -= .01
        array[i+5] -=0.1
        if(array[i] > 600 || array[i+2] > 600) {
            array[i] -= Math.random() * 800 - 300;
            array[i+2] -= Math.random() * 800 - 300;
        }
        if(array[i+3] > 600 || array[i+4] > 600) {
          array[i+3] -= Math.random() * 800 - 300;
          array[i+4] -= Math.random() * 800 - 300;
      }
    }
    starGeo.attributes.position.needsUpdate = true
    

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();


