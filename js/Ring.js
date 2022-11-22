import * as THREE from "three";

export default class Ring {
  constructor(inRadius, outRadius ) {
    this.inRadius = inRadius
    this.outRadius = outRadius
    
  }

  getMesh() {
    const progressGeo = new THREE.RingGeometry(this.inRadius, this.outRadius, 100);
    const progressMat = new THREE.MeshBasicMaterial({color: '#808080',  side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(progressGeo, progressMat);
    this.mesh.rotation.x = 1.57
    
    return this.mesh;
  }
}