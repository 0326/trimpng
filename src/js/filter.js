/**
 * 图像过滤处理算法
 * @author 0326
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
  for (let pixel of pixels) {
    imgData.data[i++] = pixel.r
    imgData.data[i++] = pixel.g
    imgData.data[i++] = pixel.b
    imgData.data[i++] = pixel.a
  }
  return imgData
}

/**
 * 空白像素处理算法
 * step1: 扫描并标记出可疑白点(flag = 1)
 * step2: 从alpha=0的透明点出发，一旦发现可疑白点直接擦除
 */
function trimPixels(pixels, options) {
  const width = options.width
  const height = options.height
  const getDirectionPixel = (direction, p) => {
    let x = p.index/width
    let y = p.index%width
    let res = null
    switch (direction) {
      case 'left': x > 0 ? res = pixels[p.index - 1] : undefined
        break
      case 'top': y > 0 ? res = pixels[p.index - width] : undefined
        break
      case 'right': x + 1 < width ? res = pixels[p.index + 1] : undefined
        break
      case 'bottom': y + 1 < height ? res = pixels[p.index + width] : undefined
        break
      default: alert('impossible!')
    }
    return res
  }

  // 扫描并标记出可疑白点
  const limit = 255 - options.threshold
  const distance = options.distance
  const abs = Math.abs
  let i = 0
  for (let p of pixels) {
    p.index = i++
    if (p.r > limit &&
      p.g > limit &&
      p.b > limit &&
      abs(p.r - p.g) < distance &&
      abs(p.r - p.b) < distance &&
      abs(p.g - p.b) < distance) {
      p.flag = 1
    }
  }

  // 擦除点
  for(let p of pixels) {
    if (p.a === 0) {
      let pl = getDirectionPixel('left', p)
      let pt = getDirectionPixel('top', p)
      let pr = getDirectionPixel('right', p)
      let pb = getDirectionPixel('bottom', p)
      pl && (pl.flag === 1 || !pl.a && !pl.flag) ? pl.a = 0 : undefined
      pt && (pt.flag === 1 || !pt.a && !pt.flag) ? pt.a = 0 : undefined
      pr && (pr.flag === 1 || !pr.a && !pr.flag) ? pr.a = 0 : undefined
      pb && (pb.flag === 1 || !pb.a && !pb.flag) ? pb.a = 0 : undefined
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
    options.width = imgData.width
    options.height = imgData.height
    pixel2arrayData(trimPixels(pixels, options), imgData)
    return imgData
  },
  /**
   * 图像crop裁切，去掉多余的空白背景，按指定尺寸切边
   */
  crop(imgData) {
    const width = imgData.width
    const height = imgData.height
    let pixels = array2pixelData(imgData.data)
    const len = pixels.length
    const getVertex = (d) => {
      // 获取上下左右最边上的点, d(direction) = top|right|bottom|left
      // 是否水平方向扫描
      let isHorizontal = d => d === 'top' || d === 'bottom'
      // 是否正向扫描（左边、顶部正向扫描，右边、底部倒序扫描）
      let isStartDirct = d => d === 'top' || d === 'left'
      let i, j, p
      // if (d === 'top') {
      //   for (i = 0; i < height; i++) {
      //     for(j = 0; j < width; j++) {
      //       p = pixels[j + i * width]
      //       if (p.a !== 0) {
      //         p.x = j
      //         p.y = i
      //         return p
      //       }
      //     }
      //   }
      // }
      // if (d === 'bottom') {
      //   for (i = height - 1; i > 0; i--) {
      //     for(j = 0; j < width; j++) {
      //       p = pixels[j + i * width]
      //       if (p.a !== 0) {
      //         p.x = j
      //         p.y = i
      //         return p
      //       }
      //     }
      //   }
      // }
      // if (d === 'left') {
      //   for (i = 0; i < width; i++) {
      //     for(j = 0; j < height; j++) {
      //       p = pixels[j * width + i]
      //       if (p.a !== 0) {
      //         p.x = i
      //         p.y = j
      //         return p
      //       }
      //     }
      //   }
      // }
      // if (d === 'right') {
      //   for (i = width - 1; i > 0; i--) {
      //     for(j = 0; j < height; j++) {
      //       p = pixels[j * width + i]
      //       if (p.a !== 0) {
      //         p.x = i
      //         p.y = j
      //         return p
      //       }
      //     }
      //   }
      // }
      for (d === 'bottom' ? i = height - 1 : d === 'right' ? i = width - 1 : i = 0; d === 'top' ? i < height : d === 'left' ? i < width : i > 0; isStartDirct(d) ? i++ : i--) {
        for (j = 0; isHorizontal(d) ? j < width : j < height; j++) {
          p = isHorizontal(d) ? pixels[j + i * width] : pixels[i + j * width]
          if (p.a !== 0) {
            p.x = isHorizontal(d) ? j : i
            p.y = isHorizontal(d) ? i : j
            return p
          }
        }
      }
      return isStartDirct(d) ? Object.assign({
          x: 0,
          y: 0
        }, pixels[0]) :
        Object.assign({
          x: width - 1,
          y: height - 1
        }, pixels[len - 1])
    }
    let pt = getVertex('top')
    let pl = getVertex('left')
    let pb = getVertex('bottom')
    let pr = getVertex('right')
    let res = {
      imgData
    }
    res.sx = pt.x < pl.x ? pt.x : pl.x // 需要截取的起始点x坐标
    res.sy = pt.y < pl.y ? pt.y : pl.y // 需要截取的起始点y坐标
    res.dx = pr.x > pb.x ? pr.x : pb.x // 需要截取的终点x坐标
    res.dy = pr.y > pb.y ? pr.y : pb.y // 需要截取的终点y坐标
    res.sw = res.dx - res.sx + 1 // 截取空白之后留下的有效宽度
    res.sh = res.dy - res.sy + 1 // 截取空白之后留下的有效高度

    return res
  }
}
