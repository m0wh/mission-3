import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
// import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import World from './ts/World'
import grainVertexShader from './glsl/grain.vert'
import grainFragmentShader from './glsl/grain.frag'

// Add terrain
const geo = new THREE.PlaneGeometry(100, 100)
const mat = new THREE.MeshBasicMaterial({ color: 0x050505 })
const terrain = new THREE.Mesh(geo, mat)
terrain.rotation.x = -Math.PI / 2

// post-fx
const bloomFx = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.1, 0, 0.1)
// const glitchFx = new GlitchPass()
const grainFx = new ShaderPass({
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0 }
  },
  vertexShader: grainVertexShader,
  fragmentShader: grainFragmentShader
})
const fxaa = new ShaderPass(FXAAShader)

const world = new World({
  onInit: ({ scene, camera, renderer, composer }) => {
    renderer.toneMapping = THREE.LinearToneMapping

    camera.position.y = 3
    camera.position.z = 10
    camera.lookAt(0, 3, 0)

    scene.add(terrain)

    composer.addPass(bloomFx)
    // composer.addPass(glitchFx)
    composer.addPass(fxaa)
    composer.addPass(grainFx)

    scene.background = new THREE.Color(0xc9cdcc)
    scene.fog = new THREE.FogExp2(0xc9cdcc, 0.08)
  },
  onUpdate: time => {
    // eslint-disable-next-line dot-notation
    grainFx.uniforms['amount'].value = time % 1000
  }
})

world.init()
