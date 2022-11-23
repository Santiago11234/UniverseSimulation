
import * as THREE from 'three';
import {OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import Planet from "./js/Planet.js";
import Rotation from "./js/Rotation.js"
import Ring from "./js/Ring.js"
import { geoInterpolate } from 'https://cdn.skypack.dev/pin/d3-geo@v3.0.1-kwyelOm8gApBxT2oVVB9/mode=imports/optimized/d3-geo.js';
import { MeshBasicMaterial, Vector3 } from 'three';


var Shaders = {
    'atmosphere' : {
      uniforms: {},
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'float intensity = pow( 1.0 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 10.0 );',
          'gl_FragColor = vec4(.2549, .615,0.85 , 0.2 ) * intensity;',
          
        '}'
      ].join('\n')
    }
  };



var isRotating = false;
//code for changing sizes within website
const gui = new dat.GUI();
const world = {
    earth: {
        radius: 1,
        DayLight: false,
        stopRotation: false
    }
}

var earthImg = new Image();
earthImg.src="images/earth.jpeg"
var earthNImg = new Image();
earthNImg.src="images/earthNight.jpeg"

var starImg = new Image();
starImg.src="images/star.png"


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
const earthgeometry = new THREE.SphereGeometry(1,50,50);
const earthmaterial = new THREE.MeshBasicMaterial( { 
    map: new THREE.TextureLoader().load(earthImg.src)
 } );
const earthMesh = new THREE.Mesh( earthgeometry, earthmaterial );
scene.add(earthMesh);



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

let sprite = new THREE.TextureLoader().load(starImg.src);
let starMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.2,
  map: sprite
});

const stars = new THREE.Points(starGeo,starMaterial);
scene.add(stars);


//rings
const rings = []
for(let i = 0; i < 6; i++) {
const mercRing= new Ring(1.1, 1.12)
const r1Mesh= mercRing.getMesh();
r1Mesh.rotation.x = Math.random()*Math.PI - Math.PI/2
r1Mesh.rotation.y = Math.random()*Math.PI - Math.PI/2
r1Mesh.rotation.z = Math.random()*Math.PI - Math.PI/2
rings.push(r1Mesh)
scene.add(r1Mesh) 

}

var atmosGeometry = new THREE.SphereGeometry(1,100,100);
var shader = Shaders['atmosphere'];
var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

var atmosMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

var mesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
mesh.scale.set( 1.1, 1.1, 1.1 );
scene.add(mesh);



//what actually displays the images
new OrbitControls(camera, renderer.domElement);
camera.position.z = 3;



var t =0;
function animate() {
    
if(isRotating === true) {
    earthMesh.rotation.y += 0.01
    rings.forEach(r => {
      r.rotation.y +=0.001
      r.rotation.z +=0.001
      r.rotation.x +=0.001
    })
    
    
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

