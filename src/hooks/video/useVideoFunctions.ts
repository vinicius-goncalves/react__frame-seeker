import { useVideoContext } from './useVideoContext';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface MediaStreamVideoElement extends HTMLVideoElement {
    captureStream(): MediaStream;
}

export function useVideoFunctions() {
    const { videoRef } = useVideoContext();

    const video = videoRef.current as MediaStreamVideoElement;

    const getVideoSettings = () => {
        const [track] = video.captureStream().getVideoTracks();
        const { width, height } = track.getSettings();
        return { width, height } as { width: number; height: number };
    };

    return { getVideoSettings };
}
