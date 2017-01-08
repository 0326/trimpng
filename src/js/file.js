let FILENAME = 'trim.png'

export default {
  initImgUploadEvent(id, callback) {
    let isLoad = false
    let $btn = document.getElementById(id)

    $btn.addEventListener('click', (e) => {
      if (isLoad) {
        console.log('正在打开...')
        return e.preventDefault()
      } else {
        $btn.previousElementSibling.innerText = '正在打开'
        isLoad = true
        setTimeout(() => {
          isLoad = false
          $btn.previousElementSibling.innerText = '重新上传'
        }, 10000)
      }
    })

    $btn.addEventListener('change', (e) => {
      let file = e.target.files[0]
      console.log('change..')
      isLoad = false
      $btn.previousElementSibling.innerText = '重新上传'

      if (!file) {
        return
      }

      if (!file.type.match('image.*')) {
        return alert('请上传图片文件！')
      }
      FILENAME = file.name
      let reader = new FileReader()
      reader.readAsDataURL(file)
        // reader.readAsArrayBuffer(file)
        // reader.readAsBinaryString(file)
      reader.onload = (obj) => {
        callback && callback(obj)
      }
    })
  },
  initImgDownloadEvent(id, $canvas) {
    let $dld = document.getElementById(id)
    $dld.addEventListener('click', (e) => {
      let imgData = $canvas.toDataURL('image/png')
      $dld.href = imgData.replace('image/png', 'image/octet-stream')
      $dld.download = FILENAME.replace('.png', '_trim.png')
    })
  }
}
