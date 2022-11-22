
import * as THREE from 'three';
import {OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import Planet from "./Planet.js";
import Rotation from "./Rotation.js"


var day = true
var isRotating = true;
//code for changing sizes within website
const gui = new dat.GUI();
const world = {
    earth: {
        radius: 2.5,
        DayLight: false,
        stopRotation: false
    }
}

gui.add(world.earth, 'DayLight').onChange(function (value) {
    if(day) {
        earthMesh.material.dispose()
        earthMesh.material = new THREE.MeshBasicMaterial( { 
            map: new THREE.TextureLoader().load('/earthNight.jpeg')
         } ); 
        moonMesh.material.dispose()
        moonMesh.material = new THREE.MeshBasicMaterial( { 
            map: new THREE.TextureLoader().load('/moonNigh.jpeg'),
            
         } ); 
    }
    else {
        earthMesh.material.dispose()
        earthMesh.material = new THREE.MeshBasicMaterial( { 
            map: new THREE.TextureLoader().load('/earth.jpeg')
         } ); 
        moonMesh.material.dispose()
        moonMesh.material = new THREE.MeshBasicMaterial( { 
            map: new THREE.TextureLoader().load('/moonDay.jpeg')
         } ); 
    }
    day = !day;
}); 

gui.add(world.earth, 'stopRotation', false).onChange(function (value) {
    isRotating = !isRotating
});


//init all three.js create compononets

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer(
    {
        antialias: true
})

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);


//creates the earth
const earthgeometry = new THREE.SphereGeometry(2.5,25);
const earthmaterial = new THREE.MeshBasicMaterial( { 
    map: new THREE.TextureLoader().load('/earth.jpeg')
 } );
const earthMesh = new THREE.Mesh( earthgeometry, earthmaterial );
const earthSystem = new THREE.Group();
earthSystem.add(earthMesh);
scene.add(earthMesh);

//sun
const sungeometry = new THREE.SphereGeometry(100,25,25);
const sunmaterial = new THREE.MeshBasicMaterial( { 
    map: new THREE.TextureLoader().load('/sun.jpeg')
    
 } );
const sun = new THREE.Mesh( sungeometry, sunmaterial );
scene.add( sun );
sun.position.x = 100
sun.position.z = -200

//moon
const moon = new Planet(1, 50, "/moonDay.jpeg");
const moonMesh = moon.getMesh();
let moonSystem = new THREE.Group();
moonSystem.add(moonMesh);
scene.add(moonMesh);
const moonRotation = new Rotation(moonMesh)
const moonRotationMesh = moonRotation.getMesh();
moonSystem.add(moonRotationMesh)


earthSystem.add(moonSystem)

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

let sprite = new THREE.TextureLoader().load( "/star.png");
let starMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.7,
  map: sprite
});

const stars = new THREE.Points(starGeo,starMaterial);
scene.add(stars);




//add light for the front and back
const light = new THREE.DirectionalLight(0xFFFFFF,0);
light.position.set(0,10,0);
light.castShadow = true
scene.add(light);

scene.add(camera);





//what actually displays the images
new OrbitControls(camera, renderer.domElement);
camera.position.z = 10;

var t =0;
function animate() {
    
if(isRotating === true) {
    earthMesh.rotation.y += 0.01

    moonMesh.rotation.y += 0.01
    moonMesh.position.x = earthMesh.position.x + 5*Math.cos(t) + 0;
    moonMesh.position.z = earthMesh.position.z + 5*Math.sin(t) + 0; 
    
    t+= 0.01
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
}



    requestAnimationFrame(animate);
    renderer.render(scene, camera);
 

}
animate();

