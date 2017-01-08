/*
 * The Entry file
 */

import file from './file'
import ImgFilter from './filter'
import test from './test'

let canvasEl = document.getElementById('J_Canvas')
let ctx = canvasEl.getContext('2d')

test.test(canvasEl, ctx)

/**
 * 初始化图片上传事件
 */
file.initImgUploadEvent('J_ImgUpload', (obj) => {
  //  绘制图像到canvas
  let currImg = new Image()
  currImg.src = obj.target.result
  currImg.onload = (e) => {
    canvasEl.parentElement.classList.remove('empty')
    canvasEl.width = currImg.width
    canvasEl.height = currImg.height
    ctx.drawImage(currImg, 0, 0)
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
  let cropObj = ImgFilter.crop(imgData)

  let img = new Image()
  img.src = canvasEl.toDataURL()

  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
  canvasEl.width = cropObj.sw
  canvasEl.height = cropObj.sh
  ctx.drawImage(img, cropObj.sx, cropObj.sy, cropObj.sw, cropObj.sh, 0, 0, canvasEl.width, canvasEl.height)

  console.log(cropObj)
})

function initCanvas() {
  canvasEl.parentElement.classList.add('empty')
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
  canvasEl.width = 500
  canvasEl.height = 260
}
