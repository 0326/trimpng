/*
 * The Entry file
 */

// import 'babel-polyfill'
import config from './config'
import file from './file'
import ImgFilter from './filter'

let canvasEl = document.getElementById('J_Canvas')
let ctx = canvasEl.getContext('2d')

/**
 * 初始化图片上传事件
 */
file.initImgUploadEvent('J_ImgUpload', (obj) => {
  //  绘制图像到canvas
  let img = new Image()
  img.src = obj.target.result
  img.onload = (e) => {
    canvasEl.parentElement.classList.remove('empty')
    canvasEl.width = img.width
    canvasEl.height = img.height
    ctx.drawImage(img, 0, 0)
  }
})

/**
 * 初始化图片保存事件
 */
file.initImgDownloadEvent('J_ImgDownload', canvasEl)

/**
 * 初始化清空画布事件
 */
document.getElementById('J_EmptyBtn').addEventListener('click', (e) => {
  initCanvas()
})

/**
 * 初始化trim图像事件
 */
document.getElementById('J_ImgTrim').addEventListener('click', (e) => {
  let imgData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height)
  ctx.putImageData(ImgFilter.trim(imgData), 0, 0)

  console.log(imgData)
})


/**
 * 初始化crop图像事件
 */
document.getElementById('J_ImgCrop').addEventListener('click', (e) => {
  let imgData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height)
  ctx.putImageData(ImgFilter.crop(imgData), 0, 0)

  console.log(imgData)
})

function initCanvas() {
  canvasEl.parentElement.classList.add('empty')
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
  canvasEl.width = 400
  canvasEl.height = 260
}

