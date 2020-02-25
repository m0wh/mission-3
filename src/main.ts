import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import World from './ts/World'
import grainVertexShader from './glsl/grain.vert'
import grainFragmentShader from './glsl/grain.frag'

// Add terrain
const geo = new THREE.PlaneGeometry(100, 100)
const mat = new THREE.MeshBasicMaterial({ color: 0x050505 })
const terrain = new THREE.Mesh(geo, mat)
terrain.rotation.x = -Math.PI / 2

const geo2 = new THREE.ConeGeometry(2, 3)
const line = new THREE.EdgesGeometry(geo2)
const mat2 = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 0 })
const box = new THREE.Mesh(line, mat2)
box.position.y = 10

// post-fx noise
const grainFx = new ShaderPass({
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0 }
  },
  vertexShader: grainVertexShader,
  fragmentShader: grainFragmentShader
})

const bloomFx = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 2, 0, 0.1)

const glitchFx = new GlitchPass()

const world = new World({
  onInit: ({ scene, camera, renderer, composer }) => {
    renderer.toneMapping = THREE.LinearToneMapping

    camera.position.y = 3
    camera.position.z = 10
    camera.lookAt(0, 3, 0)

    scene.add(terrain)
    scene.add(box)

    grainFx.renderToScreen = true
    glitchFx.goWild = true

    composer.addPass(grainFx)
    composer.addPass(bloomFx)
    composer.addPass(glitchFx)

    scene.background = new THREE.Color(0xc9cdcc)
    scene.fog = new THREE.FogExp2(0xc9cdcc, 0.08)
  },
  onUpdate: time => {
    // eslint-disable-next-line dot-notation
    grainFx.uniforms['amount'].value = time % 1000
  }
})

world.init()
