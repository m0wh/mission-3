import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

export default class World {
  public scene = new THREE.Scene()
  public camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  private renderer = new THREE.WebGLRenderer()
  private onUpdate: (time: number) => void
  private onInit: (context: any) => void
  private startTime: number
  private composer = new EffectComposer(this.renderer)

  constructor ({ onInit = (context: any): void => {}, onUpdate = (time: number): void => {} }) {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.onInit = onInit
    this.onUpdate = onUpdate
  }

  init (): void {
    this.startTime = Date.now()
    this.animate()
    this.onInit({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      composer: this.composer
    })
  }

  animate (): void {
    const time = Date.now() - this.startTime
    requestAnimationFrame(this.animate.bind(this))
    this.onUpdate(time)
    this.composer.render()
  }
}
