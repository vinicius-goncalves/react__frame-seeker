export { createVideoElement }

function createVideoElement(blob, width = 1000, height = 600) {
    
    const video = document.createElement('video')

    const attributes = {
        width,
        height,
        muted: true,
        controls: true,
        preload: 'auto',
        src: URL.createObjectURL(blob)
    }

    const attributesEntries = Object.entries(attributes)
    attributesEntries.forEach(([ attr, value ]) => video.setAttribute(attr, value))

    return video

}