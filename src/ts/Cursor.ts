import { mouse, lerp } from './utils'

export default class Cursor {
  private el: HTMLElement = document.createElement('div')
  private className: string = 'cursor'
  private lerpAmt: number = 0.1
  private hovering: boolean = false
  private position: { x: number, y: number } = {
    x: (mouse.x + 1) * window.innerWidth / 2,
    y: (mouse.y + 1) * window.innerHeight / 2
  }

  constructor (className: string = 'cursor', lerpAmt: number = 0.1) {
    this.lerpAmt = lerpAmt
    this.className = className
  }

  init (): void {
    this.el.style.position = 'fixed'
    this.el.style.pointerEvents = 'none'
    this.el.style.transform = 'translate(-50%, -50%)'
    this.el.classList.add(this.className)

    document.body.append(this.el)

    requestAnimationFrame(this.update.bind(this))
  }

  update (): void {
    this.position = {
      x: lerp(this.position.x, (mouse.x + 1) * window.innerWidth / 2, this.lerpAmt),
      y: lerp(this.position.y, (mouse.y + 1) * window.innerHeight / 2, this.lerpAmt)
    }

    if (mouse.target) {
      this.hovering = ['a', 'button'].includes(mouse.target.tagName.toLowerCase())
    }

    this.draw()
    requestAnimationFrame(this.update.bind(this))
  }

  draw (): void {
    this.el.style.left = this.position.x + 'px'
    this.el.style.top = this.position.y + 'px'
    this.el.classList.toggle('hovering', this.hovering)
  }
}
