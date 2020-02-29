import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class World {
  public scene = new THREE.Scene()
  public camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 500)
  private renderer = new THREE.WebGLRenderer({ antialias: true })
  private onUpdate: (time: number, context: any) => void
  private onInit: (context: any) => void
  private startTime: number
  private controls = new OrbitControls(this.camera, this.renderer.domElement)

  constructor ({ onInit = (context: any): void => {}, onUpdate = (time: number, context: any): void => {} }) {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.resize()
    document.body.appendChild(this.renderer.domElement)
    this.controls.target = new THREE.Vector3(5, 0, 5)
    this.controls.update()

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
      renderer: this.renderer
    })
  }

  private resize (): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.controls.update()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private animate (): void {
    const time = Date.now() - this.startTime
    this.onUpdate(time, {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer
    })

    requestAnimationFrame(this.animate.bind(this))
    this.renderer.render(this.scene, this.camera)
  }
}
