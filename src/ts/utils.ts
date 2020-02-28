export const mouse = { x: 0, y: 0, target: null }

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX / window.innerWidth * 2 - 1
  mouse.y = e.clientY / window.innerHeight * 2 - 1
  mouse.target = e.target
})

export function lerp (start, end, amt) { return (1 - amt) * start + amt * end }

export function openFullscreen (elem: any = document.documentElement) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  }
}
