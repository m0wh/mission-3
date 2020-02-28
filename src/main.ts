import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import gsap from 'gsap'
import World from './ts/World'
import createTerrain from './ts/terrain'
import { mouse, lerp, openFullscreen } from './ts/utils'
import grainVertexShader from './glsl/grain.vert'
import grainFragmentShader from './glsl/grain.frag'
// import Cursor from './ts/Cursor'
import initializingSrc from './assets/audio/0-initializing.mp3'

// Sound
const music = new Audio(initializingSrc)

// Cursor
// const cursor = new Cursor('cursor', 0.1)
// cursor.init()

// post-fx
const bloomFx = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.05, 0.5, 0)
const fxaa = new ShaderPass(FXAAShader)
const grainFx = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, amount: { value: 0 } },
  vertexShader: grainVertexShader,
  fragmentShader: grainFragmentShader
})

const cameraLookingAt = new THREE.Vector3(mouse.x, 3 - mouse.y, 7)

const tl = gsap.timeline({ paused: true })

let terrain
const world = new World({
  onInit: ({ scene, camera, renderer, composer }) => {
    renderer.toneMapping = THREE.LinearToneMapping

    camera.position.y = 1.5
    camera.position.z = 10
    camera.rotation.z = 0
    camera.lookAt(cameraLookingAt)

    scene.background = new THREE.Color(0xc9cdcc)
    scene.fog = new THREE.FogExp2(0xc9cdcc, 0.07)

    terrain = createTerrain(scene)
    scene.add(terrain.mesh)

    composer.addPass(bloomFx)
    composer.addPass(fxaa)
    composer.addPass(grainFx)

    tl
      .from(scene.fog, 10, { density: 0.3 }, 10)
      .from(camera.position, 10, { y: 20, ease: 'cubic.inOut' }, 10)
      .to(scene.fog.color, 1, { r: 1, g: 0.2, b: 0, ease: 'expo.in' }, 41.5)
      .to(scene.background, 1, { r: 1, g: 0.2, b: 0, ease: 'expo.in' }, 41.5)
      .to(scene.fog.color, 4, { r: 201 / 255, g: 205 / 255, b: 204 / 255, ease: 'cubic.inOu' }, 75)
      .to(scene.background, 4, { r: 201 / 255, g: 205 / 255, b: 204 / 255, ease: 'cubic.inOu' }, 75)
      .to(scene.fog, 10, { density: 0.5 }, 80)
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

world.init()

tl
  .to('.enter', 1, { autoAlpha: 0, y: 10 }, 0)
  .set('.landing', { display: 'none' }, 1)
  .from('.title', 1, { y: '100%', autoAlpha: 0, delay: 1, ease: 'expo.out' }, 3.5)
  .from('canvas', 10, { autoAlpha: 0, ease: 'cubic.inOut' }, 5)
  .from('.link', 1, { y: '-100%', autoAlpha: 0, ease: 'expo.out' }, 20)
  .to('.wrapper > *', 1.2, { color: '#000' }, 87)

document.querySelector('.enter').addEventListener('click', () => {
  openFullscreen()
  music.currentTime = 2.5
  music.play()
  tl.play()
})
