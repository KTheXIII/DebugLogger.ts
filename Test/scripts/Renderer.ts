class Renderer {
  context: CanvasRenderingContext2D
  fillStyle: string = '#000'
  clearStyle: string = '#000'

  constructor(context: CanvasRenderingContext2D) {
    this.context = context
  }

  clear(): void {
    this.context.fillStyle = this.clearStyle
    this.context.fillRect(0, 0, this.width, this.height)
  }

  get width(): number {
    return this.context.canvas.width
  }

  get height(): number {
    return this.context.canvas.height
  }
}

export default Renderer
