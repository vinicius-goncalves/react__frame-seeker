import { useEffect } from 'react';
import { Frame, IFrame } from '../common/classes/FrameManager';
import { createDOMVideo } from '../common/utils/createDOMVideo';
import { framesActions } from '../services/slices/framesSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { useWorker } from './useWorker';
import { useVideoFunctions } from './video/useVideoFunctions';
import { useVideoManager } from './video/useVideoManager';

const worker = new Worker(new URL('../services/workers/worker', import.meta.url), { type: 'module' });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const frameUtils = (sendWorkerMessage: any) => {
    return {
        async getFrame(frame: Frame) {
            const { res } = await sendWorkerMessage({ action: 'check-frame', data: frame });
            return res;
        },

        async addFrame(frame: Frame) {
            const { res } = await sendWorkerMessage({ action: 'add-frame', data: frame });
            return res;
        },

        async toFrameBlob(
            video: HTMLVideoElement,
            canvas: OffscreenCanvas,
            context: OffscreenCanvasRenderingContext2D,
            { toUrl = false }: { toUrl: boolean },
        ) {
            const options: ImageEncodeOptions = { type: 'image/jpeg', quality: 1 };
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const blob = await canvas.convertToBlob(options);
            return toUrl ? URL.createObjectURL(blob) : blob;
        },
    };
};

export function useFramesManager() {
    const { getVideoSettings } = useVideoFunctions();
    const { sendWorkerMessage } = useWorker(worker);
    const { details } = useVideoManager();
    const { status } = useAppSelector(({ framesSlice }) => framesSlice);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (status.isExtracting || status.isFinished || !status.isVideoLoaded) return;

        const { addFrame, getFrame, toFrameBlob } = frameUtils(sendWorkerMessage);

        const video = createDOMVideo(details.url);
        dispatch(framesActions.setStatus({ isExtracting: true }));

        const handleFramesExtractor = () => {
            const { width, height } = getVideoSettings();

            const canvas = new OffscreenCanvas(width, height);
            const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

            video.play();
            video.addEventListener('play', () => {
                (async function extract() {
                    if (video.ended) return;

                    const frameId = crypto.randomUUID();
                    const currTime = video.currentTime.toFixed(2);
                    const frameFound = await getFrame(new Frame(frameId, currTime));

                    if (typeof frameFound === 'undefined') {
                        const frameBlob = await toFrameBlob(video, canvas, context, { toUrl: true });
                        const newFrame = new Frame(frameId, currTime, frameBlob);
                        const f = await addFrame(newFrame);
                        dispatch(framesActions.pushFrame(f as IFrame));
                    }

                    requestAnimationFrame(extract);
                })();
            });

            video.addEventListener('ended', () => {
                dispatch(framesActions.setStatus({ isExtracting: false }));
                dispatch(framesActions.setStatus({ isFinished: true }));
                video.remove();
            });
        };

        video.addEventListener('loadedmetadata', handleFramesExtractor);
        video.load();

        return () => {
            video.addEventListener('loadedmetadata', handleFramesExtractor);
        };
    }, [details, dispatch, getVideoSettings, status, sendWorkerMessage]);

    return { start: () => console.log('hello world') };
}
