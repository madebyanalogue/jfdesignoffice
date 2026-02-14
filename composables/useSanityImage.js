export const useSanityImage = () => {
  const getImageSrc = (asset) => {
    // Defensive check - ensure we have something
    if (!asset) return ''
    
    // If it's already a string (URL), return it directly
    if (typeof asset === 'string') {
      return String(asset)
    }
    
    // Try to get the URL property - ensure it's a string
    try {
      const url = asset?.url
      if (url && typeof url === 'string' && url.length > 0) {
        return String(url)
      }
    } catch (e) {
      // Ignore errors accessing url
    }
    
    // Fallback: try to construct URL from asset ID
    try {
      const id = asset?._id
      if (id && typeof id === 'string') {
        // Extract parts from "image-abc123-1920x1080-jpg"
        const match = String(id).match(/image-([^-]+)-(\d+)x(\d+)-(\w+)/)
        if (match) {
          const [, assetId, width, height, ext] = match
          return `https://cdn.sanity.io/images/go8920y3/production/${assetId}-${width}x${height}.${ext}`
        }
      }
    } catch (e) {
      // Ignore errors
    }
    
    // Last resort: return empty string
    console.warn('[useSanityImage] Could not extract image URL from asset:', asset)
    return ''
  }
  
  return {
    getImageSrc
  }
}

