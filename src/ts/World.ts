import * as THREE from 'three'

export default class World {
  public scene = new THREE.Scene()
  public camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  private renderer = new THREE.WebGLRenderer()
  private onUpdate: (time: number) => void
  private onInit: () => void
  private startTime: number

  constructor ({ onInit = (): void => {}, onUpdate = (time: number): void => {} }) {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
    this.onUpdate = onUpdate
    this.onInit = onInit
    this.camera.position.z = 10
    this.camera.lookAt(0, 0, 0)
  }

  init (): void {
    this.startTime = Date.now()
    this.animate()
    this.onInit()
  }

  animate (): void {
    const time = Date.now() - this.startTime
    requestAnimationFrame(this.animate.bind(this))
    this.onUpdate(time)
    this.renderer.render(this.scene, this.camera)
  }
}
