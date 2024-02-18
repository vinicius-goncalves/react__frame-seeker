import { AnimationsManager, Mark, VideoDetails } from './classes.js'
import { createVideoElement } from './utils/dom-manipulation.js'

const worker = {
    ref: null
}

const scriptPaths = {
    'dom-manipulation': './js/utils/dom-manipulation.js'
}

;(() => {

    worker.ref = new Worker('js/workers/frames-processor.js')
    worker.ref.postMessage('Worker initialized')

    Object.entries(scriptPaths).forEach(([ file, path ]) => {

        const script = document.createElement('script')
        script.dataset.id = file
        script.type = 'module'
        script.src = path

        const body = document.querySelector('body')
        body.insertAdjacentElement('beforeend', script)

    })
})()

const animationsManager = new AnimationsManager()

async function extractFrames(DOMVideo) {

    if(!(DOMVideo instanceof HTMLMediaElement && DOMVideo instanceof HTMLVideoElement)) {
        throw new TypeError('The DOMVideo must be a valid HTML video media.')
    }

    const promise = new Promise(resolve => {

        const { ['ref']: workerRef } = worker

        function startEvents() {

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

const selectVideoBtn = document.querySelector('input.select-video-btn')

function loadLocalFile() {

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

function startVideoEvents(externalVideo) {

    const tempMark = new Mark()

    function seekingForFrame(event) {

        const pageX = event.pageX
        const offsetY = event.offsetY, offsetX = event.offsetX

        if(!(offsetY >= externalVideo.height - (150 / 2)) || offsetX < 15 || offsetX >= externalVideo.width - 15) {
            tempMark.remove()
            return
        }

        const secondsConversion = (event.offsetX / externalVideo.offsetWidth) * externalVideo.duration
        const lastSeconds = Math.abs(secondsConversion).toFixed(1)

        const ref = tempMark.addIntoDOM()
        tempMark.updateCoords(pageX - (ref.offsetWidth / 2), externalVideo.height - (150 / 2))

        worker.ref.postMessage({ do: 'get-frame-by-seconds', item: { lastSeconds } })
    }

    const getAllFramesEvents = ['seeking', 'mousemove']

    getAllFramesEvents.forEach((event) =>
        externalVideo.addEventListener(event, seekingForFrame))

    worker.ref.addEventListener('message', (event) => {

        const { data } = event, { action_result } = data

        if(action_result !== 'get-frame-by-seconds') {
            return
        }

        const { res } = data, { exists, frameFound } = res

        if(!exists) {
            console.info('Frame did not found')
            return
        }

        const frameObjectURL = URL.createObjectURL(frameFound.frame)
        tempMark.updateImage(frameObjectURL)

    })
}

async function startFrameSeeker() {

    const blobFile = await loadLocalFile()

    const hiddenVideo = createVideoElement(blobFile)
    extractFrames(hiddenVideo).then((res) => console.info(res))

    const externalVideo = hiddenVideo.cloneNode(true)
    selectVideoBtn.replaceWith(externalVideo)

    startVideoEvents(externalVideo)
}

selectVideoBtn.addEventListener('click', startFrameSeeker)