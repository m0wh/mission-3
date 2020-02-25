import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import World from './ts/World'
import createTerrain from './ts/terrain'
import { mouse, lerp } from './ts/utils'
import grainVertexShader from './glsl/grain.vert'
import grainFragmentShader from './glsl/grain.frag'

// Add terrain
const terrain = createTerrain()

// post-fx
const bloomFx = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.1, 0, 0.1)
const glitchFx = new GlitchPass()
const grainFx = new ShaderPass({
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0 }
  },
  vertexShader: grainVertexShader,
  fragmentShader: grainFragmentShader
})
const fxaa = new ShaderPass(FXAAShader)

const cameraLookingAt = new THREE.Vector3(mouse.x, 3 - mouse.y, 7)

const world = new World({
  onInit: ({ scene, camera, renderer, composer }) => {
    renderer.toneMapping = THREE.LinearToneMapping

    camera.position.y = 3
    camera.position.z = 10
    camera.lookAt(cameraLookingAt)

    scene.add(terrain)

    composer.addPass(bloomFx)
    composer.addPass(glitchFx)
    composer.addPass(fxaa)
    composer.addPass(grainFx)

    scene.background = new THREE.Color(0xc9cdcc)
    scene.fog = new THREE.FogExp2(0xc9cdcc, 0.1)
  },
  onUpdate: (time, { camera }) => {
    // eslint-disable-next-line dot-notation
    grainFx.uniforms['amount'].value = time % 1000
    cameraLookingAt.set(
      lerp(cameraLookingAt.x, mouse.x, 0.05),
      lerp(cameraLookingAt.y, 2 - mouse.y, 0.05),
      7
    )
    camera.lookAt(cameraLookingAt)
  }
})

world.init()
