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
  let i = 0
  for( let pixel of pixels) {
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
    let width = imgData.width
    let height =  imgData.height
    let pixels = array2pixelData(imgData.data)
    let len = pixels.length
    let getVertex = (d) => {
      // 获取上下左右最边上的点, d(direction) = top|right|bottom|left
      let i, j, p
      let isHorizontal = (d) => { return d === 'top' || d === 'bottom' }
      let isStartDirct = (d) => { return d === 'top' || d === 'left' }
      for(d === 'bottom' ? i = height - 1 : d === 'right' ? i = width - 1 : i = 0;
          d === 'top' ? i < height : d === 'left' ? i < width : i > 0;
          isStartDirct(d) ? i++ : i-- ) {
        for(j = 0; isHorizontal(d) ? j < width : j < height; j++) {
          p = isHorizontal(d) ? pixels[j + i * width] : pixels[i + j * height]
          if(p.a !== 0) {
            p.x = isHorizontal(d) ? j : i
            p.y = isHorizontal(d) ? i : j
            return p
          }
        }
      }
      return isStartDirct(d) ? Object.assign({x: 0, y: 0}, pixels[0]) :
        Object.assign({x: width - 1, y: height - 1}, pixels[len - 1])
    }

    let pt = getVertex('top')
    let pl = getVertex('left')
    let pb = getVertex('bottom')
    let pr = getVertex('right')
    let res = { imgData }
    res.sx = pt.x < pl.x ? pt.x : pl.x  // 需要截取的起始点x坐标
    res.sy = pt.y < pl.y ? pt.y : pl.y  // 需要截取的起始点y坐标
    res.dx = pr.x > pb.x ? pr.x : pb.x  // 需要截取的终点x坐标
    res.dy = pr.y > pb.y ? pr.y : pb.y  // 需要截取的终点y坐标
    res.sw = res.dx - res.sx + 1        // 截取空白之后留下的有效宽度
    res.sh = res.dy - res.sy + 1        // 截取空白之后留下的有效高度

    return res
  }
}

