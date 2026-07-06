import { useState, useRef } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase/config'

export default function MediaUploader({
  images = [],
  onImagesChange,
  path = 'products',
  maxFiles = 10,
  maxSizeMB = 5,
}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef(null)

  const handleUpload = async (files) => {
    const fileList = Array.from(files)
    if (images.length + fileList.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    for (const file of fileList) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File ${file.name} exceeds ${maxSizeMB}MB limit`)
        continue
      }

      setUploading(true)
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const storageRef = ref(storage, `${path}/${fileName}`)
      const task = uploadBytesResumable(storageRef, file)

      await new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          (err) => { alert('Upload failed'); reject(err) },
          async () => {
            const url = await getDownloadURL(task.snapshot.ref)
            onImagesChange?.([...images, url])
            resolve()
          }
        )
      })
    }

    setUploading(false)
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeImage = (index) => {
    onImagesChange?.(images.filter((_, i) => i !== index))
  }

  const moveImage = (from, to) => {
    const updated = [...images]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    onImagesChange?.(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={i} className="relative group w-24 h-24 bg-gray-100 rounded overflow-hidden border border-gray-200">
            <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              {i > 0 && (
                <button onClick={() => moveImage(i, i - 1)} className="text-white text-xs p-1 hover:bg-white/20 rounded" title="Move left">◀</button>
              )}
              {i < images.length - 1 && (
                <button onClick={() => moveImage(i, i + 1)} className="text-white text-xs p-1 hover:bg-white/20 rounded" title="Move right">▶</button>
              )}
              <button onClick={() => removeImage(i)} className="text-red-300 text-xs p-1 hover:bg-white/20 rounded" title="Remove">✕</button>
            </div>
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-ink/80 text-white text-[10px] text-center py-0.5">Main</span>
            )}
            {i === 1 && (
              <span className="absolute bottom-0 left-0 right-0 bg-gray-700/80 text-white text-[10px] text-center py-0.5">Hover</span>
            )}
          </div>
        ))}

        {images.length < maxFiles && (
          <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gold hover:bg-gray-50 transition-colors">
            {uploading ? (
              <span className="text-xs text-gray-500">{progress}%</span>
            ) : (
              <>
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] text-gray-400 mt-1">Upload</span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-ink h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      <p className="text-xs text-gray-500">
        {images.length}/{maxFiles} images · Max {maxSizeMB}MB each · First image = main, second = hover
      </p>
    </div>
  )
}
