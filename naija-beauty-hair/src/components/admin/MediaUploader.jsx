import { useState, useRef } from 'react'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { useToast } from '../ui/Toast'
import { friendlyError } from '../../utils/errors'

export default function MediaUploader({ images = [], onImagesChange, path = 'uploads', maxFiles = 5, maxSizeMB = 5 }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef(null)
  const toast = useToast()

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    if (images.length + files.length > maxFiles) {
      toast.warning(`Maximum ${maxFiles} images allowed`, `You can upload ${maxFiles - images.length} more.`)
      return
    }

    const oversized = files.find(f => f.size > maxSizeMB * 1024 * 1024)
    if (oversized) {
      toast.warning(`"${oversized.name}" exceeds ${maxSizeMB}MB limit`, 'Compress the image and try again.')
      return
    }

    setUploading(true)
    setProgress(0)

    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadToCloudinary(files[i], path)
        onImagesChange([...images, url])
      } catch (err) {
        const e = friendlyError(err)
        toast.error(`${e.message} — "${files[i].name}"`, e.suggestion)
      }
      setProgress(((i + 1) / files.length) * 100)
    }

    setUploading(false)
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={i} className="relative w-20 h-20 rounded border border-gray-200 overflow-hidden group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}
        {images.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:border-gold hover:text-gold transition-colors text-xl disabled:opacity-50"
          >
            {uploading ? '⟳' : '+'}
          </button>
        )}
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-gold h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      <p className="text-xs text-gray-500">Max {maxFiles} images, {maxSizeMB}MB each</p>
    </div>
  )
}
