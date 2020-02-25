import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import World from './ts/World'
import grainVertexShader from './glsl/grain.vert'
import grainFragmentShader from './glsl/grain.frag'

// Add terrain
const geo = new THREE.PlaneGeometry(100, 100)
const mat = new THREE.MeshBasicMaterial({ color: 0x050505 })
const terrain = new THREE.Mesh(geo, mat)
terrain.rotation.x = -Math.PI / 2

// post-fx noise
const grainFx = new ShaderPass({
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0 }
  },
  vertexShader: grainVertexShader,
  fragmentShader: grainFragmentShader
})

const world = new World({
  onInit: ({ scene, camera, composer }) => {
    camera.position.y = 3
    camera.position.z = 10
    camera.lookAt(0, 3, 0)
    grainFx.renderToScreen = true
    composer.addPass(grainFx)

    scene.background = new THREE.Color(0xc9cdcc)
    scene.fog = new THREE.FogExp2(0xc9cdcc, 0.08)
    scene.add(terrain)
  },
  onUpdate: time => {
    // eslint-disable-next-line dot-notation
    grainFx.uniforms['amount'].value = time % 1000
  }
})

world.init()
