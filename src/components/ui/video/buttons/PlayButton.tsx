import { useVideoManager } from '../../../../hooks';
import VideoControlButton from './ControlButton';

const PlayButton = () => {
    const { details, togglePlay } = useVideoManager();

    return (
        <VideoControlButton
            type={details.isPlaying ? 'pause' : 'play_arrow'}
            onClick={togglePlay}
            className="text-3xl"
        />
    );
};

export default PlayButton;
