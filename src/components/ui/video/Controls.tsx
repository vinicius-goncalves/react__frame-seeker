import { memo } from 'react';
import { useVideoManager } from '../../../hooks';
import VideoControlButton from './buttons/ControlButton';
import PlayButton from './buttons/PlayButton';
import StopButton from './buttons/StopButton';
import VolumeButton from './buttons/VolumeButton';

const Controls = memo(() => {
    const { setCurrTime, details } = useVideoManager();

    const handleForward = () => {
        if (details.currTime < details.duration - 5) setCurrTime(details.currTime + 5);
    };

    const handleRewind = () => {
        if (details.currTime >= 5) {
            setCurrTime(details.currTime - 5);
        }
    };

    return (
        <menu className="flex h-min w-full select-none items-center justify-center gap-3 py-1.5 text-white">
            <VideoControlButton type="replay_5" onClick={handleRewind} className="text-2xl" />
            <StopButton />
            <PlayButton />
            <VolumeButton />
            <VideoControlButton type="forward_5" onClick={handleForward} className="text-2xl" />
        </menu>
    );
});

export default Controls;
