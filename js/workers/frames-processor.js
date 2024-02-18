const FramesManager = (function() {

    const frames = Object.setPrototypeOf([], null)

    this.find = function find(id) {

        const findPromise = new Promise(resolve => {
            const frameFound = Array.prototype.find.call(frames,
                    (frame) => JSON.stringify(frame.id) === JSON.stringify(id))
            resolve(frameFound)
        })

        return findPromise
    }

    this.add = function add(frame) {

        const addPromise = new Promise(resolve => {
            Array.prototype.push.call(frames, frame)
            resolve({ added: true, frame })
        })

        return addPromise
    }

    this.getAll = function getAll() {
        return frames
    }
})

const framesManager = new FramesManager()

self.addEventListener('message', async (event) => {

    const { data } = event

    if(data.do === 'check-for-frame') {

        const { id } = data.item

        const frameFound = await framesManager.find(id)
        const res = frameFound ? { exists: true } : { exists: false }
        self.postMessage(res)

        return
    }

    if(data.do === 'add-frame') {

        const { id, frame } = data.item

        const res = await framesManager.add({ id, frame })
        self.postMessage(res)

        return
    }

    if(data.do === 'get-all-frames') {
        self.postMessage({ action_result: 'get-all-frames', res: framesManager.getAll() })
        return
    }

    if(data.do === 'get-frame-by-seconds') {

        const { lastSeconds } = data.item
        const frameFound = await framesManager.find(lastSeconds)

        const o = frameFound ? { exists: true, frameFound } : { exists: false }

        self.postMessage({ action_result: 'get-frame-by-seconds', res: o })

        return
    }
})

self.addEventListener('error', () => {
    console.log('An error ocurred when tried to initialize the Worker.')
})