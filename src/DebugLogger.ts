interface LoggerConfig {
  loopStatusLogOn?: boolean
  overlayOn?: boolean
  graphOn?: boolean
  isCompact?: boolean
}

class Logger {
  protected loopStatusLogOn: boolean
  protected overlayOn: boolean
  protected graphOn: boolean
  protected isCompact: boolean

  protected containerID: string = 'debug-container'
  protected containerStyle =
    'position:absolute;top:0;transform:translate(6px,6px);padding:5pt;padding-top:4pt;border-radius:5px;display:grid;gap:1px;color:#ffffff;background-color:rgba(0,0,0,0.5);cursor:default;z-index:10;overflow:hidden;'
  protected style = {
    fontFamily: "font-family:'Roboto Mono',monospace;",
    fontSize: 'font-size:10pt;',
    fontWeight: 'font-weight:300;',
    noselect:
      '-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default;',
  }

  constructor(config?: LoggerConfig) {
    this.loopStatusLogOn =
      config && config.loopStatusLogOn != null ? config.loopStatusLogOn : true
    this.overlayOn =
      config && config.overlayOn != null ? config.overlayOn : false
    this.graphOn = config && config.graphOn != null ? config.graphOn : false
    this.isCompact =
      config && config.isCompact != null ? config.isCompact : true
  }
}

class GraphLogger {
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private dimension: number[] = [256, 36]

  private data: number[] = []
  bufferSize: number = 128

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.width *= 2
    this.height *= 2
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.innerHTML = 'Your browser does not support HTML5'
    this.canvas.title = 'Frame time over time'

    this.context = this.canvas.getContext('2d')
  }

  update(data: number): void {
    this.data.push(data)
    if (this.data.length > this.bufferSize - 1) this.data.shift()
  }

  render(): void {
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.globalAlpha = 0.25
    this.context.fillStyle = '#000000'
    this.context.fillRect(0, 0, this.width, this.height)

    this.context.globalAlpha = 1.0
    this.context.strokeStyle = '#f5426f'
    this.context.beginPath()
    this.context.lineWidth = 2
    this.context.moveTo(-5, this.height / 2)

    let data: number
    let scaleData: number
    for (let i = 0; i < this.bufferSize; i++) {
      data = this.data[i]
      scaleData = data * 2 - this.height * 0.1

      this.context.lineTo(
        i * (this.width / this.bufferSize),
        this.height - scaleData
      )
    }

    this.context.stroke()
  }

  get width(): number {
    return this.dimension[0]
  }
  set width(value: number) {
    this.dimension[0] = value
  }
  get height(): number {
    return this.dimension[1]
  }
  set height(value: number) {
    this.dimension[1] = value
  }
  get element(): HTMLCanvasElement {
    return this.canvas
  }
}

class DebugLogger extends Logger {
  private lastTime: number = 0
  private frametime: number = 0
  private framerate: number = 0

  private lastUpdate: number = 0
  private updaterate: number = 250

  private DebugContainer: HTMLElement
  private FPSElement: HTMLSpanElement
  private FTElement: HTMLSpanElement
  private LoopElement: HTMLSpanElement

  private graph: GraphLogger

  /**
   * Displays the FPS and Frametime on the DOM element.
   * The DOM element will be append to the body with absolute position.
   * @param config LoggerConfig { loopStatusLogOn?: boolean = true, overlayOn?: boolean, graphOn?: boolean, isCompact?: boolean = true}
   * @param loopToggle Callback function
   */
  constructor(config?: LoggerConfig, loopToggle?: () => any) {
    super(config)

    if (this.overlayOn) this.initDOM(loopToggle)
    if (this.graphOn && this.overlayOn) {
      this.graph = new GraphLogger()
      this.DebugContainer.appendChild(this.graph.element)
    }
  }

  /**
   * Update the DebugLogger, call this every frame
   */
  update(): void {
    this.calculateFPS()
    if (
      this.overlayOn &&
      performance.now() - this.lastUpdate > this.updaterate
    ) {
      this.lastUpdate = performance.now()
      this.updateDOM()
    }
    if (this.overlayOn && this.graphOn) {
      this.graph.update(this.frametime)
      this.graph.render()
    }
  }

  private updateDOM(): void {
    this.FPSElement.innerHTML = `${this.framerate.toFixed(2)} fps`
    this.FTElement.innerHTML = `${this.frametime.toFixed(2)} ms`
  }

  /**
   * Update the loop status. Call this every time the loop status change
   * @param tof True or False.
   */
  loopStatus(tof: boolean): void {
    if (this.overlayOn) {
      this.LoopElement.innerHTML = tof.toString()
      this.LoopElement.setAttribute(
        'style',
        `cursor:Pointer;color:${tof ? '#5EE1F0' : '#FF2E62'}`
      )
    }
    if (this.loopStatusLogOn) DebugLogger.logLoopStatus(tof)
  }

  private calculateFPS(): void {
    if (this.lastTime) {
      this.frametime = performance.now() - this.lastTime
      this.framerate = 1000 / this.frametime
    }
    this.lastTime = performance.now()
  }

  private initDOM(loopToggle?: () => any): void {
    this.DebugContainer = document.getElementById(this.containerID)
      ? document.getElementById(this.containerID)
      : document.createElement('div')
    this.DebugContainer.id = this.containerID
    this.DebugContainer.setAttribute(
      'style',
      `${this.containerStyle}
      ${this.style.fontFamily}
      ${this.style.fontSize}
      ${this.style.fontWeight}
      ${this.style.noselect}`
    )
    this.DebugContainer.setAttribute('class', 'noselect debug-overlay')

    let cc: HTMLDivElement = document.createElement('div')
    this.FPSElement = document.createElement('span')
    this.FPSElement.innerHTML = '00.00 fps'
    this.FPSElement.title = 'Displaying the current frame rate'

    this.FTElement = document.createElement('span')
    this.FTElement.innerHTML = '00.00 ms'
    this.FTElement.title = 'Displaying the current frame time'

    if (this.isCompact) {
      const spacer = document.createElement('span')
      spacer.innerHTML = ', '

      cc.appendChild(this.FPSElement)
      cc.appendChild(spacer)
      cc.appendChild(this.FTElement)
      this.DebugContainer.appendChild(cc)
    } else {
      let cc: HTMLDivElement = document.createElement('div')
      let txt: HTMLSpanElement = document.createElement('span')
      txt.innerHTML = 'framerate: '
      cc.appendChild(txt)
      cc.appendChild(this.FPSElement)
      this.DebugContainer.appendChild(cc)

      cc = document.createElement('div')
      txt = document.createElement('span')
      txt.innerHTML = 'frametime: '
      cc.appendChild(txt)
      cc.appendChild(this.FTElement)
      this.DebugContainer.appendChild(cc)
    }

    const LSC: HTMLDivElement = document.createElement('div')
    const LSText = document.createElement('span')
    LSText.innerHTML = 'loop: '
    LSC.appendChild(LSText)
    this.LoopElement = document.createElement('span')
    this.LoopElement.innerHTML = 'null'
    this.LoopElement.title = 'Display current status of the loop.'
    if (loopToggle) {
      this.LoopElement.addEventListener('click', loopToggle)
      this.LoopElement.setAttribute('style', 'cursor: Pointer;color:#9C8CF3')
    }
    LSC.appendChild(LSText)
    LSC.appendChild(this.LoopElement)
    this.DebugContainer.appendChild(LSC)

    document.body.appendChild(this.DebugContainer)
  }

  /**
   * Prints in the console if loop is true or false
   * @param tof true or false
   */
  static logLoopStatus(tof: boolean): void {
    const base = "font-size:14px;font-family:'Roboto Mono',monospace;"
    const style = `
    ${base}
    color:#252525;
    background-color: ${tof ? '#68F48E' : '#FF6B6B'};
    padding: 0px;
    padding-bottom: 1px;
    padding-left:5px;
    padding-right: ${tof ? 14 : 6}px;`

    console.log(`%cloop: %c${tof}`, base, style)
  }
}

export default DebugLogger
