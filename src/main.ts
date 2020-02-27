import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import gsap from 'gsap'
import World from './ts/World'
import createTerrain from './ts/terrain'
import { mouse, lerp } from './ts/utils'
import grainVertexShader from './glsl/grain.vert'
import grainFragmentShader from './glsl/grain.frag'
import Cursor from './ts/Cursor'

// Cursor
const cursor = new Cursor('cursor', 0.1)
cursor.init()

// post-fx
const bloomFx = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.05, 0.5, 0)
const fxaa = new ShaderPass(FXAAShader)
const grainFx = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, amount: { value: 0 } },
  vertexShader: grainVertexShader,
  fragmentShader: grainFragmentShader
})

const cameraLookingAt = new THREE.Vector3(mouse.x, 3 - mouse.y, 7)

let terrain
const world = new World({
  onInit: ({ scene, camera, renderer, composer }) => {
    renderer.toneMapping = THREE.LinearToneMapping

    scene.background = new THREE.Color(0xc9cdcc)
    scene.fog = new THREE.FogExp2(0xc9cdcc, 0.07)

    camera.position.y = 1.5
    camera.position.z = 10
    camera.lookAt(cameraLookingAt)

    terrain = createTerrain(scene)
    scene.add(terrain.mesh)

    composer.addPass(bloomFx)
    composer.addPass(fxaa)
    composer.addPass(grainFx)
  },
  onUpdate: (time, { camera }) => {
    if (terrain) {
      // eslint-disable-next-line dot-notation
      terrain.material.uniforms['uTime'].value = time / 1000
    }

    // eslint-disable-next-line dot-notation
    grainFx.uniforms['amount'].value = time % 1000
    cameraLookingAt.set(
      lerp(cameraLookingAt.x, mouse.x, 0.05),
      lerp(cameraLookingAt.y, 1 - mouse.y, 0.05),
      7
    )
    camera.lookAt(cameraLookingAt)
  }
})

const tl = gsap.timeline({ paused: true })
tl
  .to('.enter', 1, { autoAlpha: 0, y: 10 })
  .from('.title', 1, { y: '100%', autoAlpha: 0, delay: 1, ease: 'cubic.out' })
  .add(() => world.init())
  .from('canvas', 5, { autoAlpha: 0, delay: 1 })
  .from('.link', 1, { y: '-100%', autoAlpha: 0, ease: 'cubic.out' }, '-=3')

document.querySelector('.enter').addEventListener('click', () => tl.play())
