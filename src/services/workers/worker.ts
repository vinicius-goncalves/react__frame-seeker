import { Frames, IFrame } from '../../common/classes/FrameManager';

const frames = new Frames();

self.addEventListener('message', (event: MessageEvent<{ action: string; data: IFrame }>) => {
    const { action, data } = event.data;

    if (action === 'check-frame') {
        const frameFound = frames.find(data.frameId);
        self.postMessage({ action: 'check-frame', res: frameFound });
    }

    if (action === 'add-frame') {
        frames.add(data);
        self.postMessage({ action: 'add-frame', res: data });
    }

    if (action === 'get-all-frames') {
        return frames.getAll();
    }
});

export {};
