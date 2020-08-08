import DebugLogger from 'src/DebugLogger'
import Renderer from './Renderer'

const app: HTMLDivElement = document.querySelector('#app')
const canvas: HTMLCanvasElement = document.createElement('canvas')
app.appendChild(canvas)
canvas.style.width = '100%'
canvas.style.height = '100%'
resize(canvas)
const context: CanvasRenderingContext2D = canvas.getContext('2d')
const r: Renderer = new Renderer(context)

const DEBUG = new DebugLogger(
  {
    graphOn: true,
    overlayOn: true,
    loopStatusLogOn: true,
  },
  toggle
)

let animationID: number = -1

start()

function start() {
  r.clearStyle = '#101010'

  DEBUG.loopStatus(true)
  run()
}

function run() {
  update()
  render()

  DEBUG.update()

  animationID = requestAnimationFrame(run)
}

function update() {}

function render() {
  r.clear()
}

function stop() {
  cancelAnimationFrame(animationID)
  animationID = -1
  DEBUG.loopStatus(false)
}

function toggle() {
  if (animationID === -1) start()
  else stop()
}

function resize(canvas: HTMLCanvasElement) {
  const displayWidth = Math.floor(canvas.clientWidth * devicePixelRatio)
  const displayHeight = Math.floor(canvas.clientHeight * devicePixelRatio)

  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    canvas.width = displayWidth
    canvas.height = displayHeight
  }
}
