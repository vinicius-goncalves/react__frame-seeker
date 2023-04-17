import { AnimationsManager, CustomFrame, VideoDetails } from './classes.js';

const worker = {
    ref: null
}

;(() => {

    worker.ref = new Worker('js/workers/frames-processor.js')
    worker.ref.postMessage('Worker initialized')

})()

const video = document.querySelector('video')
const animationsManager = new AnimationsManager()

async function extractFrames(DOMVideo) {

    if(!(DOMVideo instanceof HTMLMediaElement && DOMVideo instanceof HTMLVideoElement)) {
        throw new TypeError('The DOMVideo must be a valid HTML video media.')
    }

    const promise = new Promise(resolve => {

        const { ['ref']: workerRef } = worker

        function startEvents() {

            // video.currentTime = 5.4

            console.log('Starting')

            DOMVideo.play()
            DOMVideo.muted = true

            const videoTrack = DOMVideo.captureStream().getVideoTracks().at(0)
            const { width, height } = videoTrack.getSettings()

            const canvas = new OffscreenCanvas(width, height)
            const context = canvas.getContext('2d')

            canvas.width = width
            canvas.height = height

            DOMVideo.addEventListener('play', () => {

                ;(async function invokeFrame() {

                    const videoDetails = new VideoDetails(DOMVideo)

                    workerRef.postMessage({ do: 'check-for-frame', item: videoDetails })

                    const frame = await (new Promise(resolve => {
                        worker.ref.addEventListener('message', (event) => {
                            resolve(event.data)
                        })
                    }))

                    if(!frame.exists) {
                        
                        context.drawImage(DOMVideo, 0, 0, canvas.width, canvas.height)
                        const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: .5 })
                        workerRef.postMessage({ do: 'add-frame', item: { id: videoDetails.id, frame: blob } })

                    }
                    
                    const currentAnimation = requestAnimationFrame(invokeFrame)
                    animationsManager.add(currentAnimation)

                    if (DOMVideo.ended || DOMVideo.paused) {
                        animationsManager.stopAll()
                    }

                })()

            })

            const triggersAnimationFrame = ['seeked', 'pause', 'ended', 'emptied']
            triggersAnimationFrame.forEach(action => {
                DOMVideo.addEventListener(action, async () => {

                    // animationsManager.stopAll()

                    if(DOMVideo.currentTime >= DOMVideo.duration) {
                        resolve({ finished: true, message: 'All frames were loaded.'})
                    }
                })
            })
        }

        DOMVideo.load()
        DOMVideo.addEventListener('loadedmetadata', startEvents)
    })

    const res = await promise

    if(res.finished) {

        worker.ref.postMessage({ do: 'get-all-frames' })
        
        const allFrames = new Promise(resolve => {
            worker.ref.addEventListener('message', (event) => {
                if(event.data.action_result === 'get-all-frames') {
                    resolve(event.data)
                }
            })
        })

        return allFrames
    }
}

const tempButton = document.querySelector('input.temp-button')

function handleWithInputFile() {

    return new Promise(resolve => {

        const fileInput = document.createElement('input')
        fileInput.setAttribute('type', 'file')
        fileInput.click()

        fileInput.addEventListener('change', (event) => {

            const file = event.target.files[0]
            resolve(file)

        })
    })
}

tempButton.addEventListener('click', () => {

    handleWithInputFile().then(async blobFile => {

        const internalVideo = document.createElement('video')
        internalVideo.width = 1000
        internalVideo.height = 600
        internalVideo.preload = 'auto'
        internalVideo.src = URL.createObjectURL(blobFile)

        const clonedInternalVideo = internalVideo.cloneNode(true)
        clonedInternalVideo.controls = true
        tempButton.replaceWith(clonedInternalVideo)

        clonedInternalVideo.addEventListener('seeking', () => {
            worker.ref.postMessage({ do: 'get-all-frames' })
        })

        const tempMark = new Mark()

        const mouseEventUtils = {
            mouseCoords: { 
                x: 0, 
                y: 0
            },
            other: {
                last_second: 0
            }
        }

        function updateCurrentFrame(frames, currentSeconds) {

            const framesValues = frames.reduce((acc, item) => (acc.push(Object.values(item)), acc), [])
            const frameFound = framesValues.find(([ id ]) => id === currentSeconds.toFixed(1))
        
            if(!frameFound) {
                console.info('Not exists yet')
                return 
            }

            const [ , blob ] = frameFound
            tempMark.updateImage(URL.createObjectURL(blob))
        }

        worker.ref.addEventListener('message', (event) => {

            const { data } = event
            
            if(data.action_result === 'get-all-frames') {

                const { last_second } = mouseEventUtils.other
                updateCurrentFrame(data.res, last_second)

            }
        })
        
        clonedInternalVideo.addEventListener('mousemove', (event) => {
            
            const { mouseCoords } = mouseEventUtils

            const clonedInternalVideoRect = clonedInternalVideo.getBoundingClientRect()
            mouseCoords.x = event.pageX - clonedInternalVideoRect.left
            mouseCoords.y = event.pageY - clonedInternalVideoRect.top

            const lastSeconds = 
                (mouseCoords.x / clonedInternalVideoRect.width) * clonedInternalVideo.duration

            mouseEventUtils.other.last_second = lastSeconds

            worker.ref.postMessage({ do: 'get-all-frames' })

            if(!(mouseCoords.y >= clonedInternalVideo.height - 30)) {
                tempMark.remove()
                return
            }

            const element = tempMark.addIntoDOM()
            tempMark
                .updateCoords(mouseCoords.x - (element.offsetWidth / 2.5), clonedInternalVideoRect.height - 30)
            
        })

        extractFrames(internalVideo).then(workerFramesMessage => {
            console.log(workerFramesMessage)

        })
    })
})