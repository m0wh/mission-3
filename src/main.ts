import * as THREE from 'three'
import World from './ts/World'

// Add cube
const geo = new THREE.BoxGeometry(1, 1, 1)
const mat = new THREE.MeshBasicMaterial({ color: 0xFF0000 })
const box = new THREE.Mesh(geo, mat)

const world = new World({
  onInit: () => {
    world.scene.add(box)
  },
  onUpdate: time => {
    box.rotation.z += 0.05
    box.rotation.x += 0.05
  }
})

world.init()
