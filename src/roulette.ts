export default (() => {
  const options = ['$100', '$10', '$25', '$250', '$30', '$1000', '$1', '$200', '$45', '$500', '$5', '$20', 'Lose', '$1000000', 'Lose', '$350', '$5', '$99']

  let startAngle = 0
  const arc = Math.PI / (options.length / 2)
  let spinTimeout: undefined | number

  let spinTime = 0
  let spinTimeTotal = 0

  let ctx: null | CanvasRenderingContext2D = null

  let spinAngleStart = 0

  const byte2Hex = (n: number) => {
    const nybHexString = '0123456789ABCDEF'
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1)
  }

  const RGB2Color = (r: number, g: number, b: number) => {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b)
  }

  const getColor = (item: number, maxitem: number) => {
    const phase = 0
    const center = 128
    const width = 127
    const frequency = Math.PI * 2 / maxitem

    const red = Math.sin(frequency * item + 2 + phase) * width + center
    const green = Math.sin(frequency * item + 0 + phase) * width + center
    const blue = Math.sin(frequency * item + 4 + phase) * width + center

    return RGB2Color(red, green, blue)
  }

  const drawRouletteWheel = () => {
    const canvas = document.getElementById('canvas')
    if (!(canvas instanceof HTMLCanvasElement)) {
      return
    }

    if (canvas.getContext) {
      const outsideRadius = 200
      const textRadius = 160
      const insideRadius = 125

      ctx = canvas.getContext('2d')
      if (!ctx) {
        return
      }
      ctx.clearRect(0, 0, 500, 500)

      ctx.strokeStyle = 'black'
      ctx.lineWidth = 2

      ctx.font = 'bold 12px Helvetica, Arial'

      for (let i = 0; i < options.length; i++) {
        const angle = startAngle + i * arc
        // ctx.fillStyle = colors[i];
        ctx.fillStyle = getColor(i, options.length)

        ctx.beginPath()
        ctx.arc(250, 250, outsideRadius, angle, angle + arc, false)
        ctx.arc(250, 250, insideRadius, angle + arc, angle, true)
        ctx.stroke()
        ctx.fill()

        ctx.save()
        ctx.shadowOffsetX = -1
        ctx.shadowOffsetY = -1
        ctx.shadowBlur = 0
        ctx.shadowColor = 'rgb(220,220,220)'
        ctx.fillStyle = 'black'
        ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
          250 + Math.sin(angle + arc / 2) * textRadius)
        ctx.rotate(angle + arc / 2 + Math.PI / 2)
        const text = options[i]
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0)
        ctx.restore()
      }

      // Arrow
      ctx.fillStyle = 'black'
      ctx.beginPath()
      ctx.moveTo(250 - 4, 250 - (outsideRadius + 5))
      ctx.lineTo(250 + 4, 250 - (outsideRadius + 5))
      ctx.lineTo(250 + 4, 250 - (outsideRadius - 5))
      ctx.lineTo(250 + 9, 250 - (outsideRadius - 5))
      ctx.lineTo(250 + 0, 250 - (outsideRadius - 13))
      ctx.lineTo(250 - 9, 250 - (outsideRadius - 5))
      ctx.lineTo(250 - 4, 250 - (outsideRadius - 5))
      ctx.lineTo(250 - 4, 250 - (outsideRadius + 5))
      ctx.fill()
    }
  }

  let spin = () => {
    spinAngleStart = Math.random() * 10 + 10
    spinTime = 0
    spinTimeTotal = Math.random() * 3 + 4 * 1000
    rotateWheel()
  }

  const rotateWheel = () => {
    spinTime += 30
    if (spinTime >= spinTimeTotal) {
      stopRotateWheel()
      return
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal)
    startAngle += (spinAngle * Math.PI / 180)
    drawRouletteWheel()
    spinTimeout = window.setTimeout(rotateWheel, 30)
  }

  const stopRotateWheel = () => {
    clearTimeout(spinTimeout)
    const degrees = startAngle * 180 / Math.PI + 90
    const arcd = arc * 180 / Math.PI
    const index = Math.floor((360 - degrees % 360) / arcd)

    if (!ctx) {
      return
    }
    ctx.save()
    ctx.font = 'bold 30px Helvetica, Arial'
    const text = options[index]
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10)
    ctx.restore()
  }

  const easeOut = (t: number, b: number, c: number, d: number) => {
    const ts = (t /= d) * t
    const tc = ts * t
    return b + c * (tc + -3 * ts + 3 * t)
  }

  const spinButton = document.getElementById('spin')
  if (spinButton) {
    spinButton.addEventListener('click', spin)
  }

  drawRouletteWheel()
})()
