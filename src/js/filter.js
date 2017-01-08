/**
 * 图像过滤处理算法
 */

/**
 * 原始getImageData.data 用数组存储rgba信息，转化成pixels对象存储信息，便于操作
 */
function array2pixelData(data) {
  let pixels = []
  for (let i = 0, len = data.length; i < len; i += 4) {
    pixels.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
      a: data[i + 3]
    })
  }
  return pixels
}

/**
 * pixels对象数据还原为getImageData.data 数组格式数据
 */
function pixel2arrayData(pixels, imgData) {
  // let arr = []
  let i = 0
  for( let pixel of pixels) {
    // arr.push(pixel.r)
    // arr.push(pixel.g)
    // arr.push(pixel.b)
    // arr.push(pixel.a)
    imgData.data[i++] = pixel.r
    imgData.data[i++] = pixel.g
    imgData.data[i++] = pixel.b
    imgData.data[i++] = pixel.a
  }
  return imgData
}

/**
 * 空白像素处理算法
 */
function trimPixels(pixels, options) {
  let limit = 255 - options.threshold
  let distance = options.distance
  let abs = Math.abs
  for ( let p of pixels) {
    if( p.r > limit &&
        p.g > limit &&
        p.b > limit &&
        abs(p.r - p.g) < distance &&
        abs(p.r - p.b) < distance &&
        abs(p.g - p.b) < distance) {
      p.a = 0
    }
  }
  return pixels
}

export default {
  /**
   * 图像trim算法
   */
  trim(imgData, options = {
    threshold: 30,
    distance: 20
  }) {
    let pixels = array2pixelData(imgData.data)
    pixel2arrayData(trimPixels(pixels, options), imgData)
    return imgData
  },
  /**
   * 图像crop裁切，去掉多余的空白背景，按指定尺寸切边
   */
  crop(imgData) {
    return imgData
  }
}

