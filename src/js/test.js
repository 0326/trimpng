/**
 * 图片测试
 */

export default {
  test(canvasEl, ctx) {
    document.getElementById('J_TestImgs').addEventListener('click', (e) => {
      let img = e.target
      if(img.tagName.toLowerCase() !== 'img') {
        return
      }
      let originImg = new Image()
      originImg.src = img.src
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
      canvasEl.parentElement.classList.remove('empty')
      canvasEl.width = originImg.width
      canvasEl.height = originImg.height
      ctx.drawImage(originImg, 0, 0)
    })
  }
}
