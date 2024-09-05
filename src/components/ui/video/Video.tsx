import { useEffect } from 'react';
import { tv } from 'tailwind-variants';
import { useVideoContext, useVideoManager } from '../../../hooks';
import Controls from './Controls';
import Details from './Details';
import ProgressBar from './ProgressBar';

interface Props {
    src?: string;
}

const video = tv({
    base: 'rounded-md shadow-2xl',
});

const controls = tv({
    base: 'absolute bottom-0 hidden w-full flex-col bg-gradient-to-t from-black/70 pb-1.5 pt-16 group-hover:flex',
});

function Video({ src }: Props) {
    const { videoRef } = useVideoContext();
    const { toPercentageDuration, updateDetails, getVideo, togglePlay } = useVideoManager();

    useEffect(() => {
        const video = getVideo();

        const handleTimeUpdated = () =>
            updateDetails((prevDetails) => ({ ...prevDetails, currTime: video?.currentTime || 0 }));

        const handleEnd = () => updateDetails((prevDetails) => ({ ...prevDetails, isPlaying: false }));

        const loadData = () =>
            updateDetails((prevDetails) => ({ ...prevDetails, duration: video?.duration ?? 0 }));

        video?.addEventListener('ended', handleEnd);
        video?.addEventListener('timeupdate', handleTimeUpdated);
        video?.addEventListener('click', togglePlay);
        video?.addEventListener('loadedmetadata', loadData);

        return () => {
            video?.removeEventListener('ended', handleEnd);
            video?.removeEventListener('timeupdate', handleTimeUpdated);
            video?.removeEventListener('click', togglePlay);
            video?.removeEventListener('loadedmetadata', togglePlay);
        };
    }, [getVideo, toPercentageDuration, updateDetails, togglePlay]);

    return (
        <div className="flex flex-col items-center">
            <figure className="group relative m-3 overflow-hidden rounded-md">
                <video src={src} width={900} preload="auto" className={video()} ref={videoRef} />
                <div className={controls()}>
                    <ProgressBar />
                    <Controls />
                </div>
            </figure>
            <div>
                <Details />
            </div>
        </div>
    );
}

export default Video;
