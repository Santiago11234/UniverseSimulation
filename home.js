import * as THREE from "three";


//create scene object
const scene = new THREE.Scene();

//setup camera with facing upward
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.z = 1;
camera.rotation.x = Math.PI / 2;


//setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const starGeo = new THREE.BufferGeometry()
const vertices = [];

for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 800 - 300;
    const y = Math.random() * 800 - 300;
    const z = Math.random() * 800 - 300;
    vertices.push(x, y, z);
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));



let sprite = new THREE.TextureLoader().load( '/img/star.png' );
let starMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.7,
  map: sprite
});

const stars = new THREE.Points(starGeo,starMaterial);
scene.add(stars);

animate()

//rendering loop
function animate() {

    const array = starGeo.attributes.position.array
    
    for(let i = 0; i < array.length; i+=3){

        array[i+1] -= 1.4
        if(array[i+1] < 0) {
            array[i+1] +=Math.random() * 800 - 300;
        }
    }
    starGeo.attributes.position.needsUpdate = true
    
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}