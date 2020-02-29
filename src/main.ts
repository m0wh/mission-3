import * as THREE from 'three'
import World from './ts/World'
import createTerrain from './ts/terrain'

const axesHelper = new THREE.AxesHelper(10)
const cam = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 3)
const camHelper = new THREE.CameraHelper(cam)

let terrain
const world = new World({
  onInit: ({ scene, camera, renderer, composer }) => {
    renderer.toneMapping = THREE.LinearToneMapping

    camera.position.x = -70
    camera.position.y = 35
    camera.position.z = 40
    camera.lookAt(5, 0, 5)

    axesHelper.scale.y = 1 / 3
    scene.add(axesHelper)

    scene.add(camHelper)

    scene.background = new THREE.Color(0xffffff)
    scene.fog = new THREE.FogExp2(0xffffff, 0.001)

    terrain = createTerrain(scene)
    scene.add(terrain.mesh)
  },
  onUpdate: (time) => {
    if (terrain) {
      terrain.material.uniforms.uTime.value = time / 1000
    }

    cam.position.set(5, 5, 15)
    cam.lookAt(5, 4, 5)
    camHelper.update()
  }
})

world.init()
