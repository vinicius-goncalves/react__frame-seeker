import { useVideoContext } from './useVideoContext';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface HTMLVideoElement {
    captureStream(): Record<any, any>;
}

export function useVideoFunctions() {
    const { videoRef } = useVideoContext();

    const video = videoRef.current;

    const getVideoSettings = () => {
        const [track] = video.captureStream().getVideoTracks();
        const { width, height } = track.getSettings();
        return { width, height } as { width: number; height: number };
    };

    return { getVideoSettings };
}
