import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

export default class World {
  public scene = new THREE.Scene()
  public camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
  private renderer = new THREE.WebGLRenderer({ antialias: true })
  private onUpdate: (time: number, context: any) => void
  private onInit: (context: any) => void
  private startTime: number
  private composer = new EffectComposer(this.renderer)

  constructor ({ onInit = (context: any): void => {}, onUpdate = (time: number, context: any): void => {} }) {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.resize()
    document.body.appendChild(this.renderer.domElement)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.setSize(window.innerWidth, window.innerHeight)

    this.onInit = onInit
    this.onUpdate = onUpdate
  }

  init (): void {
    this.startTime = Date.now()

    window.addEventListener('resize', this.resize.bind(this))

    this.animate()
    this.onInit({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      composer: this.composer
    })
  }

  private resize (): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private animate (): void {
    const time = Date.now() - this.startTime
    this.onUpdate(time, {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      composer: this.composer
    })

    requestAnimationFrame(this.animate.bind(this))
    this.composer.render()
  }
}
