const createThumbs = function (videoElment) {
  let canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = 150
  canvas.height = 150;
  let context = canvas.getContext('2d')
  let canvasAspectRatio = canvas.width / canvas.height
  let imageAspectRatio = videoElment.clientWidth / videoElment.clientHeight | 0
  let renderWidth = (imageAspectRatio < canvasAspectRatio) ? (videoElment.clientWidth * (canvas.height / videoElment.clientHeight))
    : canvas.width
  let renderHeight = (imageAspectRatio < canvasAspectRatio) ? canvas.height
    : (videoElment.clientHeight * (canvas.width / videoElment.clientWidth))

  renderWidth = renderWidth * 1.6
  renderHeight = renderHeight * 1.6

  context.drawImage(
    videoElment,
    (150 / 2 - renderWidth / 2),
    (150 / 2 - renderHeight / 2),
    renderWidth,
    renderHeight
  )
  let data = canvas.toDataURL('image/png')
  document.body.removeChild(canvas)
  return data
}

export default createThumbs
