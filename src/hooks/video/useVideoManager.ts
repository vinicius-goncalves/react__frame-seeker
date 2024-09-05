// import { useState } from 'react';

import { useCallback, useContext } from 'react';
import { convertToPercentage } from '../../common/utils';
import { VideoContext, VideoContextType } from '../../contexts/VideoContext';

type VideoStatus = 'play' | 'pause' | 'mute' | 'stop';

export function useVideoManager() {
    const { videoRef, _details, _updateDetails } = useContext(VideoContext) as VideoContextType;

    const getVideo = useCallback(() => videoRef.current, [videoRef]);

    const setVideoAction = useCallback(
        (action: VideoStatus) => {
            const video = getVideo();
            if (!video) return;

            switch (action) {
                case 'play':
                    video.play();
                    break;

                case 'pause':
                    video.pause();
                    break;

                case 'mute': {
                    if (video.volume >= 0.01 && video.volume <= 1) {
                        video.volume = 0;
                    } else {
                        video.volume = 1;
                    }

                    break;
                }

                case 'stop':
                    video.pause();
                    video.currentTime = 0;
                    break;
            }

            _updateDetails((prevDetails) => ({
                ...prevDetails,
                duration: video.duration,
                isMuted: video.volume === 0,
                isPlaying: !video.paused,
            }));
        },
        [_updateDetails, getVideo],
    );

    const play = () => setVideoAction('play');
    const pause = () => setVideoAction('pause');
    const stop = () => setVideoAction('stop');
    const mute = () => setVideoAction('mute');
    const togglePlay = () => (_details.isPlaying ? pause() : play());
    const toSeconds = (value: number) => value * videoRef.current!.duration;

    const toPercentageDuration = () => {
        if (!videoRef.current) return 0;

        const { duration, currentTime } = videoRef.current;
        const p = convertToPercentage(currentTime, duration) ?? 0;
        return p;
    };

    const setCurrTime = (time: number) => {
        if (videoRef.current)
            videoRef.current.currentTime = Math.min(videoRef.current.duration, Math.max(time, 0));
    };

    return {
        details: _details,
        updateDetails: _updateDetails,
        setVideoAction,
        play,
        pause,
        stop,
        mute,
        togglePlay,
        toPercentageDuration,
        toSeconds,
        setCurrTime,
        getVideo,
    };
}
