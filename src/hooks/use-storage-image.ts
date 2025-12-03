'use client'
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string'
import { useCallback } from 'react'

export function useStorageImage() {
  // PRIVATE: decode short string --> original base64
  const restore = useCallback((shortStr: string) => {
    return decompressFromEncodedURIComponent(shortStr) || ''
  }, [])

  // PRIVATE: convert original base64 -> optimized WebP blob
  const optimizeBase64 = useCallback(async (base64: string) => {
    return new Promise<Blob>((resolve) => {
      const img = new Image()
      img.src = `data:image/*;base64,${base64}`

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const MAX = 1024
        let w = img.width
        let h = img.height

        // resize optimasi
        if (w > MAX || h > MAX) {
          const ratio = Math.min(MAX / w, MAX / h)
          w = Math.round(w * ratio)
          h = Math.round(h * ratio)
        }

        canvas.width = w
        canvas.height = h
        ctx.drawImage(img, 0, 0, w, h)

        // compress WebP quality 1 (lossless) — bisa kamu turunkan nanti
        canvas.toBlob((blob) => resolve(blob!), 'image/webp', 1)
      }
    })
  }, [])

  // PUBLIC: base64 -> short string
  const shorten = useCallback((base64: string) => {
    return compressToEncodedURIComponent(base64)
  }, [])

  // PUBLIC: short string -> optimized WebP URL
  const restoreOptimized = useCallback(
    async (shortStr: string) => {
      const originalBase64 = restore(shortStr)
      const blob = await optimizeBase64(originalBase64)
      return URL.createObjectURL(blob)
    },
    [restore, optimizeBase64],
  )

  return { shorten, restoreOptimized }
}
