export function uploadToCloudinary(file, { cloudName, uploadPreset, folder = 'cyntress' }, onProgress) {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', uploadPreset)
    fd.append('folder', folder)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText).secure_url)
      } else {
        reject(new Error('Upload failed'))
      }
    }
    xhr.onerror = () => reject(new Error('Upload failed'))
    xhr.send(fd)
  })
}